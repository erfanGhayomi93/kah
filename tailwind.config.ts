import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
	darkMode: ['selector', '[data-theme="dark"]'],

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

			white: 'rgb(var(--c-white))',

			black: 'rgb(var(--c-black))',

			tooltip: 'rgba(24, 28, 47, 1)',

			primary: {
				100: 'rgb(var(--c-primary-100))',
			},

			secondary: {
				100: 'rgb(var(--c-secondary-100))',
				200: 'rgb(var(--c-secondary-200))',
				300: 'rgb(var(--c-secondary-300))',
				400: 'rgb(var(--c-secondary-400))',
				500: 'rgb(var(--c-secondary-500))',
			},

			gray: {
				50: 'rgb(var(--c-gray-50))',
				100: 'rgb(var(--c-gray-100))',
				200: 'rgb(var(--c-gray-200))',
				300: 'rgb(var(--c-gray-300))',
				400: 'rgb(var(--c-gray-400))',
				500: 'rgb(var(--c-gray-500))',
				600: 'rgb(var(--c-gray-600))',
				700: 'rgb(var(--c-gray-700))',
				800: 'rgb(var(--c-gray-800))',
			},

			error: {
				50: 'rgb(var(--c-error-50))',
				100: 'rgb(var(--c-error-100))',
				200: 'rgb(var(--c-error-200))',
				300: 'rgb(var(--c-error-300))',
				400: 'rgb(var(--c-error-400))',
			},

			success: {
				50: 'rgb(var(--c-success-50))',
				100: 'rgb(var(--c-success-100))',
				200: 'rgb(var(--c-success-200))',
				300: 'rgb(var(--c-success-300))',
				400: 'rgb(var(--c-success-400))',
			},

			warning: {
				50: 'rgb(var(--c-warning-50))',
				100: 'rgb(var(--c-warning-100))',
			},

			info: {
				50: 'rgb(var(--c-info-50))',
				100: 'rgb(var(--c-info-100))',
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
			none: 'none',
			sm: 'var(--shadow-sm)',
			DEFAULT: 'var(--shadow-sm)',
			md: 'var(--shadow-md)',
			lg: 'var(--shadow-lg)',
			xl: 'var(--shadow-xl)',
		},

		borderRadius: {
			0: '0',
			sm: '4px',
			DEFAULT: '8px',
			md: '16px',
			lg: '24px',
			'3xl': '48px',
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
			'1': '1px',
			'2': '2px',
			'4': '0.4rem',
			'6': '0.6rem',
			'8': '0.8rem',
			'10': '1rem',
			'12': '1.2rem',
			'16': '1.6rem',
			'18': '1.8rem',
			'20': '2rem',
			'22': '2.2rem',
			'24': '2.4rem',
			'28': '2.8rem',
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
			'104': '10.4rem',
			'328': '32.8rem',
		},

		transitionProperty: {
			none: 'none',
			all: 'all',
			colors: 'color, background-color, border-color',
			color: 'color',
			bg: 'background-color',
			'grid-row': 'grid-template-rows',
			opacity: 'opacity',
			shadow: 'shadow',
			transform: 'transform',
			width: 'width',
			height: 'height',
			size: 'width, height',
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

		flex: {
			'1': ' 1 1 0%',
			'1/2': '0 0 50%',
			'24': '0 0 2.4rem',
			'40': '0 0 4rem',
			'48': '0 0 4.8rem',
			'64': '0 0 6.4rem',
			'328': '0 0 32.8rem',
		},

		extend: {
			zIndex: {
				99: '99',
				999: '999',
			},
		},
	},

	plugins: [
		plugin(({ addUtilities, addVariant, theme }) => {
			addUtilities({
				'.ltr': {
					direction: 'ltr',
				},

				'.rtl': {
					direction: 'rtl',
				},

				'.skeleton': {
					'background-color': 'var(--skeleton-bg)',
					background:
						'linear-gradient(100deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 60% ) var(--skeleton-bg)',
					'background-position-x': '120%',
					'background-size': '200% 100%',
					animation: '1000ms skeleton-loading ease-in-out infinite',
				},

				'.flex-column': {
					display: 'flex',
					'flex-direction': 'column',
				},

				'.flex-column-justify-start': {
					display: 'flex',
					'flex-direction': 'column',
					'align-items': 'center',
					'justify-content': 'flex-start',
				},

				'flex-column-justify-center': {
					display: 'flex',
					'flex-direction': 'column',
					'align-items': 'center',
					'justify-content': 'center',
				},

				'flex-column-justify-end': {
					display: 'flex',
					'flex-direction': 'column',
					'align-items': 'center',
					'justify-content': 'flex-end',
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

				'.flex-items-start': {
					display: 'flex',
					'align-items': 'start',
				},

				'.flex-items-end': {
					display: 'flex',
					'align-items': 'end',
				},

				'.fit-image': {
					'background-repeat': 'no-repeat',
					'background-size': 'cover',
					'background-position': 'center',
					'background-attachment': 'local',
				},

				'.dropdown': {
					border: `1.5px solid ${theme('colors.primary.100')}`,
				},

				'.btn-primary:disabled, .btn-icon:disabled, .btn-gray:disabled, .btn-select:disabled, .btn-success:disabled, .btn-error:disabled, .btn-choose:disabled':
					{
						opacity: '0.5',
					},

				'.btn-primary': {
					display: 'flex',
					'align-items': 'center',
					color: theme('colors.white'),
					border: '1px solid transparent',
					'background-color': theme('colors.primary.100'),
					transition: 'opacity 250ms ease-in-out',

					'&:not(:disabled):hover': {
						opacity: '0.8',
					},

					'&:not(.justify-start,.justify-end)': {
						'justify-content': 'center',
					},
				},

				'.btn-primary-hover': {
					'&:not(:disabled):hover': {
						'background-color': theme('colors.primary.100'),
						'border-color': theme('colors.primary.100'),
						color: theme('colors.white'),
					},
				},

				'.btn-primary-outline': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.primary.100'),
					'font-weight': '500',
					'background-color': 'transparent',
					border: `1px solid ${theme('colors.primary.100')}`,
					transition: 'background-color 250ms, color 250ms, border-color 250ms',
					'transition-timing-function': 'ease-in-out',

					'&:not(:disabled):hover': {
						color: theme('colors.white'),
						'background-color': theme('colors.primary.100'),
						'border-color': theme('colors.primary.100'),
					},
				},

				'.btn-gray': {
					display: 'flex',
					'align-items': 'center',
					color: theme('colors.white'),
					border: '1px solid transparent',
					'background-color': theme('colors.gray.700'),
					transition: 'opacity 250ms ease-in-out',

					'&:not(:disabled):hover': {
						opacity: '0.8',
					},

					'&:not(.justify-start,.justify-end)': {
						'justify-content': 'center',
					},
				},

				'.btn-gray-outline': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.gray.700'),
					'font-weight': '500',
					'background-color': 'transparent',
					border: `1px solid ${theme('colors.gray.700')}`,
					transition: 'background-color 250ms, color 250ms, border-color 250ms',
					'transition-timing-function': 'ease-in-out',

					'&:not(:disabled):hover': {
						color: theme('colors.white'),
						'background-color': theme('colors.gray.700'),
						'border-color': theme('colors.gray.700'),
					},
				},

				'.btn-select': {
					'font-weight': '500',
					color: theme('colors.primary.100'),
					'background-color': theme('colors.secondary.100'),
					transition: 'background-color 250ms ease-in-out',

					'&:not(:disabled,.no-hover):hover': {
						'background-color': theme('colors.primary.100'),
						color: theme('colors.white'),
					},
				},

				'.btn-hover': {
					'border-color': `${theme('colors.secondary.100')} !important`,
					'background-color': theme('colors.secondary.100'),
				},

				'.btn-success': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.white'),
					border: '1px solid transparent',
					'background-color': theme('colors.success.100'),
					transition: 'opacity 250ms ease-in-out',

					'&:not(:disabled):hover': {
						opacity: '0.8',
					},
				},

				'.btn-success-outline': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.success.100'),
					'font-weight': '500',
					'background-color': 'transparent',
					border: `1px solid ${theme('colors.success.100')}`,
					transition: 'background-color 250ms, color 250ms, border-color 250ms',
					'transition-timing-function': 'ease-in-out',

					'&:not(:disabled):hover': {
						color: theme('colors.white'),
						'background-color': theme('colors.success.100'),
						'border-color': theme('colors.success.100'),
					},
				},

				'.btn-error': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.white'),
					border: '1px solid transparent',
					'background-color': theme('colors.error.100'),
					transition: 'opacity 250ms ease-in-out',

					'&:not(:disabled):hover': {
						opacity: '0.8',
					},
				},

				'.btn-error-outline': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.error.100'),
					'font-weight': '500',
					'background-color': 'transparent',
					border: `1px solid ${theme('colors.error.100')}`,
					transition: 'background-color 250ms, color 250ms, border-color 250ms',
					'transition-timing-function': 'ease-in-out',

					'&:not(:disabled):hover': {
						color: theme('colors.white'),
						'background-color': theme('colors.error.100'),
						'border-color': theme('colors.error.100'),
					},
				},

				'.btn-secondary': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.white'),
					border: '1px solid transparent',
					'background-color': theme('colors.secondary.300'),
					transition: 'opacity 250ms ease-in-out',

					'&:not(:disabled):hover': {
						opacity: '0.8',
					},
				},

				'.btn-secondary-outline': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.secondary.300'),
					'font-weight': '500',
					'background-color': 'transparent',
					border: `1px solid ${theme('colors.secondary.300')}`,
					transition: 'background-color 250ms, color 250ms, border-color 250ms',
					'transition-timing-function': 'ease-in-out',

					'&:not(:disabled):hover': {
						color: theme('colors.white'),
						'background-color': theme('colors.secondary.300'),
						'border-color': theme('colors.secondary.300'),
					},
				},

				'.btn-warning': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.gray.800'),
					border: '1px solid transparent',
					'background-color': theme('colors.warning.100'),
					transition: 'background-color 250ms ease-in-out',

					'&:not(:disabled):hover': {
						'background-color': theme('colors.warning.100'),
					},
				},

				'.btn-warning-outline': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.warning.100'),
					'font-weight': '500',
					'background-color': 'transparent',
					border: `1px solid ${theme('colors.warning.100')}`,
					transition: 'background-color 250ms, color 250ms, border-color 250ms',
					'transition-timing-function': 'ease-in-out',

					'&:not(:disabled):hover': {
						color: theme('colors.gray.800'),
						'background-color': theme('colors.warning.100'),
						'border-color': theme('colors.warning.100'),
					},
				},

				'.btn-choose': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.white'),
					border: '1px solid transparent',
					'background-color': theme('colors.primary.100'),
					transition: 'background-color 250ms ease-in-out',

					'&:not(:disabled):hover': {
						'background-color': theme('colors.primary.100'),
					},
				},

				'.btn-choose-outline': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.primary.100'),
					'font-weight': '500',
					'background-color': 'transparent',
					border: `1px solid ${theme('colors.primary.100')}`,
					transition: 'background-color 250ms, color 250ms, border-color 250ms',
					'transition-timing-function': 'ease-in-out',

					'&:not(:disabled):hover': {
						color: theme('colors.white'),
						'background-color': theme('colors.primary.100'),
						'border-color': theme('colors.primary.100'),
					},
				},

				'.btn-disabled': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.gray.500'),
					backgroundColor: 'rgba(140, 142, 151, 0.1)',
					transition:
						'color 250ms ease-in-out, background-color 250ms ease-in-out, border-color 250ms ease-in-out',
				},

				'.btn-disabled-outline': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.gray.700'),
					border: `1px solid ${theme('colors.gray.200')}`,
					transition: 'color 250ms ease-in-out, border-color 250ms ease-in-out',

					'&:not(:disabled):hover': {
						'border-color': theme('colors.gray.700'),
						color: theme('colors.gray.700'),
					},
				},

				'.btn-info-outline': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.info.100'),
					border: `1px solid ${theme('colors.info.100')}`,
					transition:
						'color 250ms ease-in-out, background-color 250ms ease-in-out, border-color 250ms ease-in-out',

					'&:not(:disabled):hover': {
						'border-color': theme('colors.info.100'),
						'background-color': theme('colors.info.100'),
						color: theme('colors.white'),
					},
				},

				'.gray-box': {
					border: `1px solid ${theme('colors.gray.200')}`,
					'background-color': theme('colors.white'),

					'&:not(.rounded-sm)': {
						'border-radius': '8px',
					},
				},

				'.icon-hover': {
					color: theme('colors.gray.700'),
					transition: 'color 250ms',
					'-webkit-transition': 'color 250ms',

					'&:hover': {
						color: theme('colors.gray.700'),
					},
				},

				'.btn-icon': {
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					color: theme('colors.gray.700'),
					backgroundColor: 'transparent',
					border: `1px solid ${theme('colors.gray.200')}`,
					transition: 'color 250ms, border-color 250ms, background-color 250ms',
					'-webkit-transition': 'color 250ms, border-color 250ms, background-color 250ms',

					'&:not(:disabled):hover': {
						color: theme('colors.white'),
						backgroundColor: theme('colors.primary.100'),
						borderColor: theme('colors.primary.100'),
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
						color: theme('colors.gray.800'),
					},

					'.input': {
						'border-radius': '0.8rem',
						border: `1px solid ${theme('colors.gray.200')}`,
						height: '4.8rem',
						padding: '0 1.6rem',

						'&:focus-within': {
							'border-color': theme('colors.primary.100'),
						},

						'&:not(:focus-within):hover': {
							'border-color': `${theme('colors.gray.500')} !important`,
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
							'border-right': `1px solid ${theme('colors.gray.200')}`,
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
					color: theme('colors.gray.500'),

					'&::before': {
						border: `1px solid ${theme('colors.gray.500')}`,
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
					color: theme('colors.success.100'),

					'&::before': {
						border: `1px solid ${theme('colors.success.100')}`,
						'border-radius': '50%',
						'background-position': 'center',
						'background-image': `url(
							"data:image/svg+xml,<svg width='12px' height='12px' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M3.5 8L4.73309 8.92482C5.16178 9.24634 5.76772 9.17279 6.10705 8.75805L10 4' stroke='rgba(36, 174, 100, 1)' stroke-linecap='round'/></svg>"
						)`,
					},
				},

				'.center': {
					left: '50%',
					top: '50%',
					transform: 'translate(-50%, -50%)',
				},

				'.center-x': {
					left: '50%',
					transform: 'translateX(-50%)',
				},

				'.center-y': {
					top: '50%',
					transform: 'translateY(-50%)',
				},

				'.input-group': {
					transition: 'border-color 200ms ease-in-out',
					'-webkit-transition': 'border-color 200ms ease-in-out',
					'-moz-transition': 'border-color 200ms ease-in-out',

					'&:not(.disabled,.error,.warning)': {
						'&:focus-within,input:focus,textarea:focus,&.focus': {
							'border-color': theme('colors.info.100'),

							'.flexible-placeholder': {
								color: theme('colors.info.100'),
								top: '0',
								right: '1.25rem !important',
								'font-size': '1.2rem',
								transform: 'translateY(calc(-100% + 0.9rem))',
								'-webkit-transform': 'translateY(calc(-100% + 0.9rem))',
							},

							'.flexible-fieldset': {
								'border-color': theme('colors.info.100'),

								legend: {
									'font-size': '1.2rem',
									'max-width': '100%',
									'-webkit-transition': 'max-width 500ms',
									transition: 'max-width 500ms',
								},
							},
						},
					},

					'&.error': {
						'border-color': theme('colors.error.100'),

						'.flexible-fieldset': {
							'border-color': theme('colors.error.100'),
						},
					},

					'&.warning': {
						'border-color': theme('colors.warning.100'),

						'.flexible-fieldset': {
							'border-color': theme('colors.warning.100'),
						},
					},

					'&:not(:focus-within,.disabled,.warning,.error):hover': {
						'border-color': theme('colors.gray.500'),

						'.flexible-fieldset': {
							'border-color': theme('colors.gray.500'),
						},
					},
				},

				'.flexible-placeholder': {
					position: 'absolute',
					'font-size': '1.4rem',
					'user-select': 'none',
					top: '50%',
					'font-weight': '400',
					right: '0.8rem',
					color: theme('colors.gray.500'),
					transform: 'translateY(-50%)',
					'-webkit-transform': 'translateY(-50%)',
					transition: 'font-size 200ms, right 200ms, top 200ms, color 200ms, transform 200ms',
					'-webkit-transition': 'font-size 200ms, right 200ms, top 200ms, color 200ms, transform 200ms',

					'&.active': {
						color: theme('colors.gray.700'),
						top: '0',
						'font-size': '1.2rem',
						right: '1.25rem !important',
						transform: 'translateY(calc(-100% + 0.9rem))',
						'-webkit-transform': 'translateY(calc(-100% + 0.9rem))',

						'&.colorful': {
							color: theme('colors.primary.100'),
						},
					},
				},

				'.flexible-fieldset': {
					position: 'absolute',
					height: 'calc(100% + 5px)',
					inset: '-5px 0 0',
					'pointer-events': 'none',
					border: `1px solid ${theme('colors.gray.200')}`,
					'border-radius': '8px',
					'text-align': 'right',
					overflow: 'hidden',
					padding: '0 0.8rem',
					'-webkit-transition': 'border-color 250ms',
					transition: 'border-color 250ms',

					legend: {
						float: 'unset',
						width: 'auto',
						overflow: 'hidden',
						display: 'inline-block',
						height: '11px',
						'font-size': '1.2rem',
						visibility: 'hidden',
						'max-width': '0',
						'white-space': 'nowrap',
						'-webkit-transition': 'max-width 100ms',
						transition: 'max-width 100ms',

						'&::after': {
							content: '"\\00A0"',
							position: 'relative',
						},

						'&::before': {
							content: '"\\00A0"',
							position: 'relative',
						},
					},

					'&.colorful': {
						'border-color': theme('colors.primary.100'),
					},

					'&.active': {
						legend: {
							'font-size': '1.2rem',
							'max-width': '100%',
							'-webkit-transition': 'max-width 500ms',
							transition: 'max-width 500ms',
						},
					},
				},

				'.spinner': {
					position: 'relative',
					display: 'inline-block',
					'vertical-align': 'middle',
					border: `1px solid ${theme('colors.primary.100')}`,
					'border-right-color': 'rgba(0, 0, 0, 0)',
					'border-radius': '50%',
					animation: '750ms linear infinite spinner-border',
				},

				':root:is([data-theme="dark"], [data-theme="darkBlue"])': {
					'.btn-select': {
						'background-color': theme('colors.secondary.200'),
					},

					'.btn-hover': {
						'background-color': theme('colors.secondary.200'),
					},

					'.gray-box': {
						'background-color': theme('colors.secondary.500'),
					},
				},
			});

			addVariant('darkBlue', ':root:is([data-theme="darkBlue"]) &');
			addVariant('dark', ':root:is([data-theme="dark"]) &');
			addVariant('darkness', ':root:is([data-theme="dark"], [data-theme="darkBlue"]) &');
		}),
	],
};

export default config;
