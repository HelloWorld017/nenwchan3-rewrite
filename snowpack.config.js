module.exports = {
	mount: {
		public: { url: '/', static: true },
		app: { url: '/dist' },
	},

	plugins: [
		'@snowpack/plugin-dotenv',
		'@snowpack/plugin-webpack',
		'./build/plugins/snowpack-plugin',
		[ '@snowpack/plugin-react-refresh', { babel: false } ],
	],

	routes: [],

	optimize: {},

	packageOptions: {},

	devOptions: {},

	buildOptions: {}
};
