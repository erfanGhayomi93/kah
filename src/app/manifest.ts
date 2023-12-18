import { type MetadataRoute } from 'next';

const manifest = (): MetadataRoute.Manifest => ({
	start_url: '/',
	name: 'Stock Screener - Search and Filter Stocks',
	short_name: 'Stock Screener',
	icons: [
		{
			src: '/static/icons/android-chrome-192x192.png',
			sizes: '192x192',
			type: 'image/png'
		},
		{
			src: '/static/icons/android-chrome-512x512.png',
			sizes: '512x512',
			type: 'image/png'
		}
	],
	prefer_related_applications: true,
	theme_color: '#262b3e',
	background_color: '#262b3e',
	display: 'standalone'
});

export default manifest;
