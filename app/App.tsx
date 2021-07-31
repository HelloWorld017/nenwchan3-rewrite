import { css } from '@linaria/core';
import { I18nProvider } from './I18nProvider';
import { IndexPage } from './pages/index.page';
import { StrictMode } from 'react';
import type { I18nKeys } from './utils/i18n';

const globalStyles = css`
	:global() {
		html, body {
			margin: 0;
			padding: 0;
		}

		:root {
			font-size: 10px;

			--font-sans:    'Pretendard', sans-serif;
			--font-display: 'Metropolis', 'Pretendard', sans-serif;
			--shadow-400:   rgba(0, 0, 0, 0.12);
			--grey-200:     #202020;
			--grey-400:     #808080;
			--grey-600:     #A0A0A0;
			--grey-900:     #ffffff;
		}
	}
`;

type AppProps = {
	lang: I18nKeys
};

export const App = ({ lang }: AppProps): JSX.Element => {
	return (
		<StrictMode>
			<I18nProvider lang={ lang }>
				<main className={ globalStyles }>
					<IndexPage />
				</main>
			</I18nProvider>
		</StrictMode>
	);
};
