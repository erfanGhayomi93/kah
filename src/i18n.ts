import { getRequestConfig } from 'next-intl/server';
import { locales } from './navigation';

export default getRequestConfig(async () => {
	const locale = locales[0];
	return {
		locale,
		messages: (await import(`../languages/${locale}.json`)).default,
	};
});
