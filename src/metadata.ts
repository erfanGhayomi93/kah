import type { Metadata } from 'next';

const metadata: Metadata = {
	metadataBase: new URL(process.env.APP_URL!),
	title: process.env.APP_TITLE,
	applicationName: process.env.APP_NAME,
	description: process.env.APP_DESCRIPTION,
	appleWebApp: {
		capable: true,
		title: process.env.APP_NAME,
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
