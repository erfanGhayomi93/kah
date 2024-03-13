const withNextIntl = require('next-intl/plugin')();
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: false,
});

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyzer(
	withNextIntl({
		reactStrictMode: false,
		webpack(config) {
			config.module.rules.push({
				test: /\.svg$/i,
				issuer: /\.[jt]sx?$/,
				use: ['@svgr/webpack'],
			})

			return config
		}
	})
);

module.exports = nextConfig;
