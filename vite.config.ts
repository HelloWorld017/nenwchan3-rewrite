import linaria from '@linaria/rollup';
import react from 'vite-preset-react';
import path from 'path';
import simplei18n from '@simplei18n/vite-plugin';
import svgr from '@svgr/rollup';

import { defineConfig } from 'vite';

const alias = { '@': path.resolve(__dirname, 'app') };

export default defineConfig({
	publicDir: './public',

	plugins: [
		react({ removeDevtoolsInProd: true, injectReact: true }),
		svgr({ svgo: false }),
		linaria({
			babelOptions: {
				plugins: [
					[
						'babel-plugin-module-resolver',
						{
							extensions: [".tsx", ".ts"],
							alias
						}
					]
				]
			}
		}),
		simplei18n()
	],

	resolve: {
		alias
	}
});
