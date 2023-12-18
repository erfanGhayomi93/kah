import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		screens: {
			sm: "480px",
			md: "768px",
			lg: "1024px",
			xl: "1280px",
			"2xl": "1536px",
			"3xl": "1920px",
		},

		colors: {
			white: 'rgba(255, 255, 255, 1)',
			black: 'rgba(74, 74, 74, 1)'
		},

		boxShadow: {
			tooltip: '0px 0px 2px 0px rgba(0, 0, 0, 0.16)',
			sm: '0px 1px 2px 0px rgba(0, 0, 0, 0.10)',
			DEFAULT: '0px 4px 4px -1px rgba(0, 0, 0, 0.10)',
			md: '0px 8px 8px -1px rgba(0, 0, 0, 0.10)',
			lg: '0px 12px 12px 0px rgba(0, 0, 0, 0.10)',
			section: '0px 2px 10px 0px rgba(0, 0, 0, 0.20)',
		},

		borderRadius: {
			0: '0',
			sm: '0.4rem',
			DEFAULT: '0.8rem',
			md: '1.6rem',
			lg: '2.4rem',
			oval: '99rem',
			circle: '50%',
		},

		spacing: {
			'0': '0',
			'4': '0.4rem',
			'8': '0.8rem',
			'16': '1.6rem',
			'24': '2.4rem',
			'32': '3.2rem',
			'40': '4.0rem',
			'48': '4.8rem',
			'56': '5.6rem',
			'64': '6.4rem',
			'72': '7.2rem',
			'80': '8.0rem',
			'88': '8.8rem',
			'96': '9.6rem'
		},
	},
	plugins: [],
};
export default config;

