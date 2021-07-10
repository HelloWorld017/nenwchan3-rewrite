const path = require('path');
const swc = require('@swc/core');

module.exports = function (snowpackConfig, pluginOptions) {
	const {
		sourceMap = true,
		isModule = true
	} = pluginOptions;

	return {
		name: 'snowpack-plugin-swc',

		async transform({ contents, fileExt, srcPath }) {
			if (fileExt !== '.js')
				return;

			return swc.transform(contents, {
				filename: path.basename(srcPath),
				sourceMaps: sourceMap,
				isModule: isModule
			});
		},
	};
};
