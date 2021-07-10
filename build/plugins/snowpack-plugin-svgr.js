const fs = require('fs');
const jsx = require('@svgr/plugin-jsx');
const transform = require('@svgr/core');

module.exports = function (snowpackConfig, pluginOptions) {
	const {
		includes = [''],
		excludes = [],
		svgrOptions = {}
	} = pluginOptions;
	
	const options = Object.assign({ icon: true }, svgrOptions);

	return {
		name: 'snowpack-plugin-svgr',

		resolve: {
			input: ['.svg'],
			output: ['.js'],
		},

		async load({ filePath }) {
			const isIncluded =
				excludes.every(filter => !filePath.includes(filter)) &&
				includes.some(filter => filePath.includes(filter));

			if (!isIncluded)
				return;

			const contents = await fs.promises.readFile(filePath, 'utf-8');

			const code = await transform(contents, options, {
				caller: {
					name: 'snowpack-plugin-svgr',
				},
				filePath,
			});

			return {
				'.js': { code }
			};
		}
	};
};
