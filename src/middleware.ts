import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
	locales: ['fa'],
	defaultLocale: 'fa',
	localePrefix: 'as-needed',
});

export const config = {
	matcher: ['/', '/((?!api|_next|_vercel|connect|.*\\..*).*)', '/(fa)/:path*'],
};
