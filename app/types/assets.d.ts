declare module '*.png' {
	const url: string;
	export default url;
}

declare module '*.svg' {
	import { SVGProps } from 'react';

	const url: string;
	export default url;
	export const ReactComponent: (props: SVGProps<SVGSVGElement>) =>
		JSX.Element;
}

declare module '*.yml' {
	const output: ReturnType<typeof JSON['parse']>;
	export default output;
}
