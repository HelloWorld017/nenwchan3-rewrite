import { hydrate, render } from 'react-dom';
import { App } from './App';

const isServerSideRendered =
	import.meta.env.RENDER_MODE === 'universal';

const renderFunction = isServerSideRendered
	? hydrate
	: render;

renderFunction(
	<App lang="ko" />,
	document.getElementById('app')
);
