import type { Metadata } from 'next';

const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
	title: 'کهکشان',
	applicationName: 'کهکشان',
	robots: 'index,follow',
	description:
		'از دیده‌بان اختیار برای جستجو و فیلتر کردن ابزارها بر اساس ارزش بازار، بازده سود سهام، حجم، سهام‌های دارای نوسان و ... آنها استفاده کنید.',
	appleWebApp: {
		capable: true,
		title: 'کهکشان',
		statusBarStyle: 'black',
	},
	icons: {
		icon: '/static/icons/favicon.png',
		shortcut: '/static/icons/favicon.png',
		apple: {
			url: '/static/icons/apple-touch-icon-180x180.png',
			sizes: '180x180',
		},
	},
	twitter: {
		card: 'summary',
		title: process.env.APP_TITLE,
		description: process.env.APP_DESCRIPTION,
		images: '/static/images/logo-preview.png',
	},
	openGraph: {
		type: 'website',
		siteName: process.env.APP_TITLE,
		images: {
			url: '/static/images/logo-preview.png',
			secureUrl: '/static/images/logo-preview.png',
			width: 1200,
			height: 630,
		},
	},
};

export default metadata;
