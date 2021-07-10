import { App } from './App';
import { StrictMode } from 'react';
import { hydrate, render } from 'react-dom';

const isServerSideRendered =
	process.env.RENDER_MODE === 'universal';

const renderFunction = isServerSideRendered
	? hydrate
	: render;

renderFunction(
	<StrictMode>
		<App />
	</StrictMode>,
	document.getElementById('app')
);

if (import.meta.hot) {
	import.meta.hot.accept();
}
