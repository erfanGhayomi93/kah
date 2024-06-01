import { NextResponse, type NextRequest } from 'next/server';

const brokerIdMatcher = [
	'^/?settings/(agreements|send_order)/?$',
	'^/?market-map',
	'^/?(orders-and-trades-reports|option-reports|financial-reports|change-broker-reports)',
];

const middleware = (request: NextRequest) => {
	try {
		if (!request.cookies.get('br_client_id')) {
			let redirection = false;
			for (let i = 0; i < brokerIdMatcher.length; i++) {
				const reg = new RegExp(brokerIdMatcher[i], 'ig');
				if (reg.test(request.nextUrl.pathname)) {
					redirection = true;
					break;
				}
			}

			if (redirection) return NextResponse.redirect(new URL('/', request.url));
		}
	} catch (e) {
		//
	}

	return NextResponse.next();
};

export const config = {
	matcher: ['/', '/((?!api|_next|_vercel|connect|.*\\..*).*)', '/(fa)/:path*'],
};

export default middleware;
