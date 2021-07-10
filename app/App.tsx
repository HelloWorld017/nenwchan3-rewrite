import { styled } from '@linaria/react';

const HelloWorld = styled.div`
	background: #123456;
`;

export const App = (): JSX.Element => {
	return <HelloWorld>
		Hello, World!
	</HelloWorld>;
};
