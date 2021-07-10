const fs = require('fs');
const linariaShaker = require('@linaria/shaker');
const linariaTransform = require('@linaria/babel-preset/lib/transform').default;
const mergeSourceMap = require('merge-source-map');
const path = require('path');
const svgrTransform = require('@svgr/core');
const swc = require('@swc/core');

const transformJs = _ => async transform => ({
	'.js': await swc.transform(transform.contents, {
		filename: path.basename(transform.filePath),
		sourceMaps: true
	})
});
transformJs.inputs = ['.js', '.ts'];
transformJs.outputs = ['.js'];

const transformJsx = snowpackConfig => async transform => {
	const contentsShaken = (snowpackConfig.mode === 'production')
		? linariaShaker(transform.filePath, {}, transform.contents)[0]
		: transform.contents;

	const result = linariaTransform(contentsShaken, {
		filename: path.basename(transform.filePath)
	});

	const output = {};

	if (result.code)
		output['.js'] = { code: result.code, map: result.sourceMap };

	if (result.cssText)
		output['.css'] = { code: result.cssText, map: result.cssSourceMapText };

	return output;
};
transformJsx.inputs = ['.jsx', '.tsx'];
transformJsx.outputs = ['.js', '.css'];

const transformSvg = _ => async transform => {
	const isSvgr = transform.filePath.startsWith('/app/components/images/');

	if (isSvgr) {
		const code = await svgrTransform(transform.contents, { icon: true }, {
			caller: {
				name: 'snowpack-plugin-svgr',
			},
			srcPath: transform.filePath,
		});

		return { '.js': { code } };
	}

	return { '.svg': { code: transform.contents } };
};
transformSvg.inputs = ['.svg'];
transformSvg.outputs = ['.js', '.svg'];


module.exports = (snowpackConfig, _) => {
	const transformers = [
		transformJs,
		transformJsx,
		transformSvg,
	].map(transformerGenerator => {
		const transformer = transformerGenerator(snowpackConfig);
		transformer.inputs = transformerGenerator.inputs;
		transformer.outputs = transformerGenerator.outputs;

		return transformer;
	});

	return {
		name: 'snowpack-plugin-nenwdev',

		resolve: {
			input: transformers
				.flatMap(transformer => transformer.inputs)
				.filter((value, index, array) => array.indexOf(value) === index),

			output: transformers
				.flatMap(transformer => transformer.outputs)
				.filter((value, index, array) => array.indexOf(value) === index),
		},

		async load(loadOptions) {
			const contents = await fs.promises.readFile(loadOptions.filePath, 'utf-8');
			const files = [
				{ ...loadOptions, contents, transformers: [] }
			];
			const outputs = {};

			while (true) {
				if (files.length === 0)
					break;

				const file = files.pop();
				const fileExt = file.fileExt;
				const matchingTransformer = transformers
					.find(transformer => (
						transformer.inputs.includes(fileExt) &&
						!file.transformers.includes(transformer)
					));

				if (!matchingTransformer) {
					outputs[file.fileExt] = { code: file.contents, map: file.map };
					continue;
				}

				const transformed = await matchingTransformer(file);
				for (const [ ext, output ] of Object.entries(transformed)) {
					files.push({
						...file,
						fileExt: ext,
						filePath: path.join(
							path.dirname(file.filePath),
							path.basename(file.filePath, file.fileExt) + ext
						),
						contents: output.code,
						map: mergeSourceMap(file.map, output.map),
						transformers: [ ...file.transformers, matchingTransformer ]
					});
				}
			}

			return outputs;
		}
	};
}
