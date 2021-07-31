import i18next from 'i18next';
import { i18n as componentsI18n } from './components/i18n';
import { mergeI18n, namespacifyI18n } from './utils/i18n';
import { I18nextProvider } from 'react-i18next';
import type { I18n, I18nKeys } from './utils/i18n';
import { ReactNode, useMemo } from 'react';

export const i18n = mergeI18n(
	componentsI18n
);

type I18nProviderProps = {
	lang: I18nKeys,
	children: ReactNode
};

export const I18nProvider = ({ lang, children }: I18nProviderProps): JSX.Element => {
	const i18nProvider = useMemo(() => {
		const provider = i18next.createInstance();

		provider.init({
			ns: ['nenwdev'],
			defaultNS: 'nenwdev',
			lng: lang,
			fallbackLng: 'en',
			resources: namespacifyI18n('nenwdev', i18n) as I18n,
			interpolation: {
				escapeValue: false
			}
		});

		console.log(namespacifyI18n('nenwdev', i18n))

		return provider;
	}, [ lang ]);

	return (
		<I18nextProvider i18n={ i18nProvider }>
			{ children }
		</I18nextProvider>
	);
};
