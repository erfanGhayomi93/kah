import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
	content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],

	theme: {
		screens: {
			sm: '480px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px',
			'3xl': '1920px',
		},

		colors: {
			transparent: 'transparent',

			current: 'currentColor',

			white: 'rgba(255, 255, 255, 1)',

			primary: {
				100: 'rgba(0, 182, 237, 1)',
				200: 'rgba(0, 142, 186, 1)',
				300: 'rgba(0, 104, 137, 1)',
				400: 'rgba(0, 68, 91, 1)',
				500: 'rgba(0, 35, 49, 1)',
			},

			hover: {
				100: 'rgba(242, 242, 242, 1)',
			},

			gray: {
				100: 'rgba(74, 74, 74, 1)',
				200: 'rgba(175, 175, 175, 1)',
				300: 'rgba(203, 203, 203, 1)',
				400: 'rgba(230, 230, 230, 1)',
			},

			link: {
				DEFAULT: 'rgba(0, 182, 237, 1)',
			},

			error: {
				100: 'rgba(206, 29, 29, 1)',
			},

			success: {
				100: 'rgba(71, 192, 134, 1)',
			},
		},

		fontSize: {
			xs: '.8rem',
			sm: '.1rem',
			tiny: '1.2rem',
			base: '1.4rem',
			lg: '1.6rem',
			xl: '1.8rem',
			'2xl': '2rem',
			'3xl': '2.4rem',
			'4xl': '3.2rem',
			'5xl': '3.6rem',
			'6xl': '4rem',
		},

		boxShadow: {
			tooltip: '0px 0px 2px 0px rgba(0, 0, 0, 0.16)',
			sm: '0px 1px 2px 0px rgba(0, 0, 0, 0.1)',
			DEFAULT: '0px 4px 4px -1px rgba(0, 0, 0, 0.1)',
			md: '0px 8px 8px -1 rgba(0, 0, 0, 0.1)',
			lg: '0px 12px 12px 0px rgba(0, 0, 0, 0.1)',
			section: '0px 2px 10px 0px rgba(0, 0, 0, 0.2)',
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
			'96': '9.6rem',
		},

		transitionDuration: {
			DEFAULT: '250ms',
		},

		transitionTimingFunction: {
			DEFAULT: 'ease-in-out',
		},
	},

	plugins: [
		plugin(({ addUtilities, theme }) => {
			addUtilities({
				'.flex-justify-center': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
				},

				'.flex-justify-between': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'space-between',
				},

				'.flex-items-center': {
					display: 'flex',
					'align-items': 'center',
				},

				'.ltr': {
					direction: 'ltr',
				},

				'.rtl': {
					direction: 'rtl',
				},

				'.btn-primary': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.white'),
					'background-color': theme('colors.primary.300'),
					transition: 'background-color 300ms ease-in-out',

					'&:hover': {
						'background-color': theme('colors.primary.200'),
					},

					'&:disabled': {
						'background-color': theme('colors.primary.400'),
					},
				},

				'.error-message': {
					position: 'absolute',
					top: 'calc(100% + 0.8rem)',
					'font-size': '1.2rem',
					'font-weight': '400',
					'padding-right': '1.6rem',
					color: theme('colors.error.100'),

					'&:before': {
						content: '',
						position: 'absolute',
						right: '0',
						top: '3px',
						width: '12px',
						height: '12px',
						'border-radius': '50%',
						'background-color': theme('colors.white'),
						border: `4px solid ${theme('colors.error.100')}`,
					},
				},
			});
		}),
	],
};
export default config;
