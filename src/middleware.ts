import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';

const brokerIdMatcher = ['^/?settings/(agreements|send_order)/?$'];

const middleware = (request: NextRequest) => {
	const handleI18nRouting = createIntlMiddleware({
		locales: ['fa'],
		defaultLocale: 'fa',
		localePrefix: 'as-needed',
	});
	const response = handleI18nRouting(request);

	try {
		if (!request.cookies.get('br_client_id')) {
			for (let i = 0; i < brokerIdMatcher.length; i++) {
				const reg = new RegExp(brokerIdMatcher[i], 'ig');
				if (reg.test(request.nextUrl.pathname)) {
					return NextResponse.redirect(new URL('/', request.url));
				}
			}
		}
	} catch (e) {
		//
	}

	return response;
};

export const config = {
	matcher: ['/', '/((?!api|_next|_vercel|connect|.*\\..*).*)', '/(fa)/:path*'],
};

export default middleware;
