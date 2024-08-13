import { NextResponse } from 'next/server';

const middleware = () => {
	return NextResponse.next();
};

export const config = {
	matcher: ['/', '/((?!api|_next|_vercel|connect|.*\\..*).*)'],
};

export default middleware;
