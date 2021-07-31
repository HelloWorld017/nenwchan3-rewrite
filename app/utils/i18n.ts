export type I18nKeys = 'ko' | 'en';
export type I18nObject = { [key: string]: string | I18nObject };
export type I18nObjectSets = { [Key in I18nKeys]?: I18nObject };
export type I18nNamespacedSets = { [Key in I18nKeys]?: { [key: string]: I18nObject } };
export type I18n = Required<I18nNamespacedSets>;

/**
* @description An utility function that puts all i18ns into given namespace
* @example
* const AI18n = { 'ko': { 'aa': '가가' }, 'en': { 'aa': 'AA' } };
* const i18n = namespacifyI18n('componentA', I18n);
*
* i18n.ko.componentA.aa //'가가'
*/
export const namespacifyI18n = (namespace: string, i18n: I18nObjectSets): I18nNamespacedSets => {
	const newSets = {} as I18nNamespacedSets;

	for (const language of Object.keys(i18n) as I18nKeys[]) {
		newSets[language] = { [namespace]: i18n[language]! };
	}

	return newSets;
};

/**
* @description An utility function that merges i18n without namespaces
* @example
* const AI18n = { 'ko': { 'aa': '가가' }, 'en': { 'aa': 'AA' } };
* const BI18n = { 'ko': { 'bb': '나나' }, 'en': { 'bb': 'BB' } };
* const i18n = mergeI18n(AI18n, BI18n);
*
* i18n.ko.aa //'가가'
* i18n.en.bb // 'BB'
*/
export const mergeI18n = (...i18ns: I18nObjectSets[]): I18nObjectSets =>
	i18ns.reduce<I18nObjectSets>(
		(existingSets, combiningSets) => {
			const newSets = {...existingSets};
			const combiningLanguages = Object.keys(combiningSets) as I18nKeys[];

			for (const language of combiningLanguages) {
				if (!newSets[language]) {
					newSets[language] = {};
				}

				newSets[language] = { ...newSets[language], ...combiningSets[language]! };
			}

			return newSets;
		},
		{} as I18nObjectSets
	);

/**
* @description An utility function that composes i18n with namespaces
* @example
* const AI18n = { 'ko': { 'aa': '가가' }, 'en': { 'aa': 'AA' } };
* const BI18n = { 'ko': { 'bb': '나나' }, 'en': { 'bb': 'BB' } };
* const i18n = combineI18n({ 'A': AI18n, 'B': BI18n });
*
* i18n.ko.A.aa //'가가'
* i18n.en.B.bb // 'BB'
*/
export const composeI18n = (i18ns: Record<string, I18nObjectSets>): I18nObjectSets =>
	mergeI18n(...Object.keys(i18ns).map(key => namespacifyI18n(key, i18ns[key])));
