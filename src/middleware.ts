import createIntlMiddleware from 'next-intl/middleware';
import { type NextRequest } from 'next/server';

const middleware = (request: NextRequest) => {
	const handleI18nRouting = createIntlMiddleware({
		locales: ['fa'],
		defaultLocale: 'fa',
		localePrefix: 'as-needed',
	});
	const response = handleI18nRouting(request);

	return response;
};

export const config = {
	matcher: ['/', '/((?!api|_next|_vercel|connect|.*\\..*).*)', '/(fa)/:path*'],
};

export default middleware;
