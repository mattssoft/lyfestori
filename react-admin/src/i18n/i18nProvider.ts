import polyglotI18nProvider from 'ra-i18n-polyglot';
import {translations} from './translations'

export const i18nProvider = polyglotI18nProvider(
    locale => translations[locale],
    'en', // default locale
    [
        { locale: 'en', name: 'English' }, 
        { locale: 'fi', name: 'Suomi' }, 
        { locale: 'sv', name: 'Svenska' }
    ],
);