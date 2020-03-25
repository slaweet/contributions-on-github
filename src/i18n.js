import { lisan } from 'lisan';
import germanDict from './i18n/de-DE';

// eslint-disable-next-line import/prefer-default-export
export const setup = (locale = 'de-DE') => {
  lisan.add(germanDict);
  lisan.setLocale(locale);
};
