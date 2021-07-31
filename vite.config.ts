import linaria from '@linaria/rollup';
import react from 'vite-preset-react';
import path from 'path';
import svgr from '@svgr/rollup';
import yaml from '@rollup/plugin-yaml';

import { defineConfig } from 'vite';

export default defineConfig({
	publicDir: './public',

	plugins: [
		react({ removeDevtoolsInProd: true, injectReact: true }),
		svgr({ svgo: false }),
		linaria(),
		yaml()
	],

	resolve: {
		alias: { '@': path.resolve(__dirname, 'app') }
	}
});
