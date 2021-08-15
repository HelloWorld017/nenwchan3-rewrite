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
			--font-sans:        'Pretendard', sans-serif;
			--font-letter:      'RIDIBatang', 'Pretendard', serif;
			--font-display:     'Metropolis', 'Pretendard', sans-serif;
			--font-code:        'Iosevka', 'Pretendard', monospace;
			--font-number:      'Lato', 'Pretendard', sans-serif;

			--shadow-400:       rgba(0, 0, 0, 0.12);

			--link-scheme-0:    #008383;
			--link-scheme-1:    #005B83;
			--link-scheme-2:    #003C83;

			--syntax-scheme-0:  #24cbd6;
			--syntax-scheme-1:  #4fcf6c;

			--bluegrey-600:     #617374;
			--bluegrey-600_rgb: 97, 115, 116;
			--bluegrey-800:     #a2adba;
			--bluegrey-800_rgb: 162, 173, 186;
			--bluegrey-900:     #c9dbef;
			--bluegrey-900_rgb: 201, 219, 239;

			--grey-100:         #101010;
			--grey-100_rgb:     16, 16, 16;
			--grey-200:         #202020;
			--grey-200_rgb:     32, 32, 32;
			--grey-280:         #404040;
			--grey-280_rgb:     64, 64, 64;
			--grey-300:         #505050;
			--grey-300_rgb:     80, 80, 80;
			--grey-400:         #808080;
			--grey-400_rgb:     108, 108, 108;
			--grey-600:         #a0a0a0;
			--grey-600_rgb:     160, 160, 160;
			--grey-700:         #cbcbcb;
			--grey-700_rgb:     203, 203, 203;
			--grey-800:         #efefef;
			--grey-800_rgb:     239, 239, 239;
			--grey-850:         #f8f8f8;
			--grey-850_rgb:     248, 248, 248;
			--grey-900:         #ffffff;
			--grey-900_rgb:     255, 255, 255;

			font-family: var(--font-sans);
			font-size: 9px;
			letter-spacing: -0.03em;
			scroll-behavior: smooth;
		}

		* {
			box-sizing: border-box;
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
