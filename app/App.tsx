import { css } from '@linaria/core';
import { I18nContext } from '@simplei18n/react';
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
			--font-sans:    'Pretendard', sans-serif;
			--font-letter:  'RIDIBatang', 'Pretendard', serif;
			--font-display: 'Metropolis', 'Pretendard', sans-serif;
			--font-code:    'Iosevka', 'Pretendard', monospace;

			--shadow-400:   rgba(0, 0, 0, 0.12);
			--blue-300:     #0b9fa9;
			--blue-400:     #24cbd6;
			--blue-800:     #a2adba;
			--blue-900:     #c9dbef;

			--green-400:    #4fcf6c;

			--grey-100:     #101010;
			--grey-200:     #202020;
			--grey-300:     #505050;
			--grey-400:     #808080;
			--grey-600:     #a0a0a0;
			--grey-700:     #cbcbcb;
			--grey-800:     #efefef;
			--grey-850:     #f8f8f8;
			--grey-900:     #ffffff;

			font-family: var(--font-sans);
			font-size: 9px;
			letter-spacing: -0.03em;
		}

		* {
			font-family: inherit;
			letter-spacing: inherit;
		}
	}
`;

type AppProps = {
	lang: I18nKeys
};

export const App = ({ lang }: AppProps): JSX.Element => {
	return (
		<StrictMode>
			<I18nContext.Provider value={ { lang } }>
				<main className={ globalStyles }>
					<IndexPage />
				</main>
			</I18nContext.Provider>
		</StrictMode>
	);
};
