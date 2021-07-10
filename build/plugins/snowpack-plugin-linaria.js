const fs = require('fs');
const path = require('path');
const shaker = require('@linaria/shaker');
const transform = require('@linaria/babel-preset/lib/transform').default;

module.exports = function (snowpackConfig, pluginOptions) {
	const {
		sourceMap = true,
		preprocessor = [],
		treeShakeOptions = {},
		...linariaOptions
	} = pluginOptions;

	return {
		name: 'snowpack-plugin-linaria',

		resolve: {
			input: ['.jsx', '.tsx'],
			output: ['.js', '.css'],
		},

		async load({ filePath }) {
			const contents = await fs.promises.readFile(filePath, 'utf-8');
			const contentsShaken = (snowpackConfig.mode === 'production')
				? shaker(filePath, treeShake, contents)[0]
				: contents;

			const result = transform(contentsShaken, {
				filename: path.basename(filePath),
				preprocessor,
				pluginOptions: linariaOptions,
			});

			const output = {};

			if (result.code)
				output['.js'] = { code: result.code, map: result.sourceMap };

			if (result.cssText)
				output['.css'] = { code: result.cssText, map: result.cssSourceMapText };


			return output;
		},
	};
};
