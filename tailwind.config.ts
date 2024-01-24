import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],

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

			inherit: 'inherit',

			white: 'rgba(255, 255, 255, 1)',

			black: 'rgba(35, 38, 41, 1)',

			primary: {
				100: 'rgba(0, 182, 237, 1)',
				200: 'rgba(0, 142, 186, 1)',
				300: 'rgba(0, 104, 137, 1)',
				400: 'rgba(0, 68, 91, 1)',
				500: 'rgba(0, 35, 49, 1)',
			},

			secondary: {
				100: 'rgba(255, 79, 37, 1)',
				200: 'rgba(197, 52, 0, 1)',
				300: 'rgba(137, 33, 0, 1)',
				400: 'rgba(81, 16, 0, 1)',
				500: 'rgba(40, 4, 0, 1)',
			},

			gray: {
				100: 'rgba(74, 74, 74, 1)',
				200: 'rgba(112, 112, 112, 1)',
				300: 'rgba(175, 175, 175, 1)',
				400: 'rgba(203, 203, 203, 1)',
				500: 'rgba(233, 236, 239, 1)',
				600: 'rgba(242, 242, 242, 1)',
				700: 'rgba(129, 132, 134, 1)',
			},

			link: {
				DEFAULT: 'rgba(0, 182, 237, 1)',
			},

			error: {
				100: 'rgba(220, 53, 69, 1)',
			},

			success: {
				100: 'rgba(25, 135, 84, 1)',
				200: 'rgba(36, 174, 100, 1)',
			},

			warning: {
				100: 'rgba(255, 193, 7, 1)',
			},
		},

		fontSize: {
			xs: '.8rem',
			sm: '1rem',
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
			sm: '4px',
			DEFAULT: '8px',
			md: '16px',
			lg: '24px',
			oval: '9999px',
			circle: '50%',
		},

		borderWidth: {
			DEFAULT: '1px',
			half: '2px',
			0: '0',
			2: '2px',
			4: '4px',
			6: '4px',
			8: '4px',
		},

		spacing: {
			'0': '0',
			'4': '0.4rem',
			'8': '0.8rem',
			'12': '1.2rem',
			'16': '1.6rem',
			'20': '2rem',
			'24': '2.4rem',
			'32': '3.2rem',
			'36': '3.6rem',
			'40': '4.0rem',
			'44': '4.4rem',
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

		fontFamily: {
			IRANSans: 'IRANSans',
		},
	},

	plugins: [
		plugin(({ addUtilities, theme }) => {
			addUtilities({
				'.ltr': {
					direction: 'ltr',
				},

				'.rtl': {
					direction: 'rtl',
				},

				'.flex-column': {
					display: 'flex',
					'flex-direction': 'column',
				},

				'.flex-justify-start': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'flex-start',
				},

				'.flex-justify-end': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'flex-end',
				},

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

				'.dropdown': {
					border: `1.5px solid ${theme('colors.primary.200')}`,
				},

				'.btn-primary': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.white'),
					border: '2px solid transparent',
					'background-color': theme('colors.primary.300'),
					transition: 'background-color 250ms ease-in-out',

					'&:not(:disabled):hover': {
						'background-color': theme('colors.primary.400'),
					},

					'&:disabled': {
						'box-shadow': 'none !important',
						'background-color': `${theme('colors.gray.500')} !important`,
						color: `${theme('colors.gray.300')} !important`,
					},
				},

				'.btn-primary-outline': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.primary.300'),
					'background-color': 'transparent',
					border: `2px solid ${theme('colors.primary.300')}`,
					transition: 'background-color 250ms, color 250ms, border-color 250ms',
					'transition-timing-function': 'ease-in-out',

					'&:not(:disabled):hover': {
						color: theme('colors.white'),
						'background-color': theme('colors.primary.300'),
						'border-color': theme('colors.primary.300'),
					},

					'&:disabled': {
						'box-shadow': 'none !important',
						'background-color': `${theme('colors.gray.500')} !important`,
						color: `${theme('colors.gray.300')} !important`,
					},
				},

				'.btn-choose': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.white'),
					border: '2px solid transparent',
					'background-color': theme('colors.primary.200'),
					transition: 'background-color 250ms ease-in-out',

					'&:not(:disabled):hover': {
						'background-color': theme('colors.primary.300'),
					},

					'&:disabled': {
						'box-shadow': 'none !important',
						'background-color': `${theme('colors.gray.500')} !important`,
						color: `${theme('colors.gray.300')} !important`,
					},
				},

				'.btn-choose-outline': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.primary.200'),
					'background-color': 'transparent',
					border: `2px solid ${theme('colors.primary.200')}`,
					transition: 'background-color 250ms, color 250ms, border-color 250ms',
					'transition-timing-function': 'ease-in-out',

					'&:not(:disabled):hover': {
						color: theme('colors.white'),
						'background-color': theme('colors.primary.200'),
						'border-color': theme('colors.primary.200'),
					},

					'&:disabled': {
						'box-shadow': 'none !important',
						'background-color': `${theme('colors.gray.500')} !important`,
						color: `${theme('colors.gray.300')} !important`,
					},
				},

				'.input-box': {
					display: 'flex',
					'flex-direction': 'column',
					gap: '0.8rem',

					input: {
						'background-color': 'transparent',
						'border-width': '0px',
					},

					'.label': {
						'font-size': '1.4rem',
						'font-weight': '500',
						color: theme('colors.gray.100'),
					},

					'.input': {
						'border-radius': '0.8rem',
						border: `1px solid ${theme('colors.gray.400')}`,
						height: '4.8rem',
						padding: '0 1.6rem',

						'&:focus-within': {
							'border-color': theme('colors.primary.300'),
						},

						'&.invalid': {
							'border-color': theme('colors.error.100'),
						},
					},

					'.prefix': {
						height: '3.2rem',
						width: '4.4rem',
						'text-align': 'center',
						display: 'flex',
						'align-items': 'center',
						'justify-content': 'flex-end',

						'&:not(.border-r-0)': {
							'border-right': `1px solid ${theme('colors.gray.400')}`,
						},
					},
				},

				'.i-null,.i-error,.i-success': {
					position: 'relative',
					'font-size': '1.4rem',
					'font-weight': '400',
					'padding-right': '1.6rem',

					'&::before': {
						content: '""',
						position: 'absolute',
						right: '0',
						top: '50%',
						transform: 'translateY(-50%)',
						width: '12px',
						height: '12px',
						'border-radius': '50%',
					},
				},

				'.i-null': {
					color: theme('colors.gray.300'),

					'&::before': {
						border: `1px solid ${theme('colors.gray.300')}`,
					},
				},

				'.i-error': {
					color: theme('colors.error.100'),

					'&::before': {
						border: `1px solid ${theme('colors.error.100')}`,
						'border-radius': '50%',
						'background-position': 'center',
						'background-image': `url(
							"data:image/svg+xml,<svg width='12px' height='12px' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M10 4L4 10' stroke='rgba(220, 53, 69, 1)' stroke-linecap='round' stroke-linejoin='round'/><path d='M4 4L10 10' stroke='rgba(220, 53, 69, 1)' stroke-linecap='round' stroke-linejoin='round'/></svg>"
						)`,
					},
				},

				'.i-success': {
					color: theme('colors.success.200'),

					'&::before': {
						border: `1px solid ${theme('colors.success.200')}`,
						'border-radius': '50%',
						'background-position': 'center',
						'background-image': `url(
							"data:image/svg+xml,<svg width='12px' height='12px' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M3.5 8L4.73309 8.92482C5.16178 9.24634 5.76772 9.17279 6.10705 8.75805L10 4' stroke='rgba(36, 174, 100, 1)' stroke-linecap='round'/></svg>"
						)`,
					},
				},
			});
		}),
	],
};
export default config;
