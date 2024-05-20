const { version } = require('./package.json');
const withNextIntl = require('next-intl/plugin')();
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: false,
});

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyzer(
	{
		reactStrictMode: false,
		trailingSlash: true,
		webpack(config) {
			config.module.rules.push({
				test: /\.svg$/i,
				use: ['@svgr/webpack'],
			})

			return config
		}
	}
);

module.exports = withNextIntl(nextConfig);
