import { composeI18n } from '@/utils/i18n';
import * as SectionAboutMeI18n from './SectionAboutMe/SectionAboutMe.i18n.yml';
import type { I18nObject } from '@/utils/i18n';

export const i18n = composeI18n({
	SectionAboutMe: SectionAboutMeI18n as I18nObject
});
