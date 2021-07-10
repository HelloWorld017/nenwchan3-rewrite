import { defineConfig } from 'vite';
import react from 'vite-preset-react';
import linaria from '@linaria/rollup';

export default defineConfig({
	publicDir: './public',

	plugins: [
		[react({ removeDevtoolsInProd: true, injectReact: true })],
		linaria()
	],

	resolve: {
		alias: { '@': './app' }
	}
});
