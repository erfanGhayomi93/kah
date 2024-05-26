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

			black: 'rgba(0, 0, 0, 1)',

			input: 'rgba(224, 224, 226, 1)',

			sidebar: 'rgba(15, 21, 39, 1)',

			info: {
				DEFAULT: 'rgba(83, 168, 255, 1)',
			},

			primary: {
				100: 'rgba(229, 238, 255, 1)',
				200: 'rgba(162, 174, 255, 1)',
				300: 'rgba(51, 121, 255, 1)',
				400: 'rgba(0, 87, 255, 1)',
				500: 'rgba(0, 58, 178, 1)',
				600: 'rgba(0, 31, 106, 1)',
			},

			secondary: {
				100: 'rgba(219, 238, 255, 1)',
				200: 'rgba(151, 217, 255, 1)',
				300: 'rgba(0, 182, 237, 1)',
				400: 'rgba(0, 142, 186, 1)',
				500: 'rgba(0, 104, 137, 1)',
			},

			gray: {
				100: 'rgba(252, 253, 254, 1)',
				200: 'rgba(248, 250, 253, 1)',
				300: 'rgba(242, 242, 242, 1)',
				400: 'rgba(233, 236, 239, 1)',
				500: 'rgba(226, 231, 237, 1)',
				600: 'rgba(219, 225, 232, 1)',
				700: 'rgba(166, 169, 173, 1)',
				800: 'rgba(154, 156, 164, 1)',
				900: 'rgba(93, 96, 109, 1)',
				1000: 'rgba(24, 28, 47, 1)',
			},

			error: {
				100: 'rgba(255, 82, 109, 1)',
				200: 'rgba(254, 57, 87, 1)',
			},

			success: {
				100: 'rgba(0, 194, 136, 1)',
				200: 'rgba(12, 175, 130, 1)',
				300: 'rgba(115, 222, 190, 1)',
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
			none: 'none',
			tooltip: '0px 0px 2px 0px rgba(0, 0, 0, 0.16)',
			sm: '0px 1px 2px 0px rgba(0, 0, 0, 0.1)',
			DEFAULT: '0px 4px 4px -1px rgba(0, 0, 0, 0.1)',
			md: '0px 8px 8px -1 rgba(0, 0, 0, 0.1)',
			lg: '0px 12px 12px 0px rgba(0, 0, 0, 0.1)',
			card: '0px 2px 11px 0px rgba(0, 0, 0, 0.05)',
			section: 'rgba(0, 0, 0, 0.1) 0px 2px 9px 2px',
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
			'2': '2px',
			'4': '0.4rem',
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
		},

		transitionProperty: {
			none: 'none',
			all: 'all',
			colors: 'color, background-color, border-color',
			opacity: 'opacity',
			shadow: 'shadow',
			transform: 'transform',
			width: 'width',
			height: 'height',
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
					border: `1.5px solid ${theme('colors.primary.200')}`,
				},

				'.btn-primary:disabled, .btn-gray:disabled, .btn-select:disabled, .btn-success:disabled, .btn-error:disabled, .btn-choose:disabled':
					{
						'&:not(.not)': {
							'box-shadow': 'none !important',
							'background-color': `${theme('colors.gray.400')} !important`,
							color: `${theme('colors.gray.800')} !important`,
						},

						'&.not': {
							opacity: '0.5',
						},
					},

				'.btn-primary': {
					display: 'flex',
					'align-items': 'center',
					color: theme('colors.white'),
					border: '2px solid transparent',
					'background-color': theme('colors.primary.400'),
					transition: 'background-color 250ms ease-in-out',

					'&:not(:disabled):hover': {
						'background-color': theme('colors.primary.300'),
					},

					'&:not(.justify-start,.justify-end)': {
						'justify-content': 'center',
					},
				},

				'.btn-primary-outline': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.primary.400'),
					'font-weight': '500',
					'background-color': 'transparent',
					border: `2px solid ${theme('colors.primary.400')}`,
					transition: 'background-color 250ms, color 250ms, border-color 250ms',
					'transition-timing-function': 'ease-in-out',

					'&:not(:disabled):hover': {
						color: theme('colors.white'),
						'background-color': theme('colors.primary.400'),
						'border-color': theme('colors.primary.400'),
					},

					'&:disabled': {
						'font-weight': '400',
						'box-shadow': 'none !important',
						'background-color': `${theme('colors.gray.400')} !important`,
						'border-color': `${theme('colors.gray.400')} !important`,
						color: `${theme('colors.gray.800')} !important`,
					},
				},

				'.btn-gray': {
					display: 'flex',
					'align-items': 'center',
					color: theme('colors.white'),
					border: '2px solid transparent',
					'background-color': theme('colors.gray.900'),
					transition: 'background-color 250ms ease-in-out',

					'&:not(:disabled):hover': {
						'background-color': theme('colors.gray.800'),
					},

					'&:not(.justify-start,.justify-end)': {
						'justify-content': 'center',
					},
				},

				'.btn-gray-outline': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.gray.900'),
					'font-weight': '500',
					'background-color': 'transparent',
					border: `2px solid ${theme('colors.gray.900')}`,
					transition: 'background-color 250ms, color 250ms, border-color 250ms',
					'transition-timing-function': 'ease-in-out',

					'&:not(:disabled):hover': {
						color: theme('colors.white'),
						'background-color': theme('colors.gray.900'),
						'border-color': theme('colors.gray.900'),
					},

					'&:disabled': {
						'box-shadow': 'none !important',
						'background-color': `${theme('colors.gray.400')} !important`,
						color: `${theme('colors.gray.800')} !important`,
					},
				},

				'.btn-select': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.primary.400'),
					border: `2px solid ${theme('colors.primary.400')}`,
					'background-color': theme('colors.primary.100'),
					transition: 'background-color 250ms ease-in-out',

					'&:not(:disabled,.no-hover):hover': {
						'background-color': theme('colors.primary.400'),
						color: theme('colors.white'),
					},
				},

				'.btn-hover': {
					'border-color': `${theme('colors.primary.100')} !important`,
					'background-color': theme('colors.primary.100'),
				},

				'.btn-success': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.white'),
					border: '2px solid transparent',
					'background-color': theme('colors.success.100'),
					transition: 'background-color 250ms ease-in-out',

					'&:not(:disabled):hover': {
						'background-color': theme('colors.success.200'),
					},
				},

				'.btn-success-outline': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.success.200'),
					'font-weight': '500',
					'background-color': 'transparent',
					border: `2px solid ${theme('colors.success.100')}`,
					transition: 'background-color 250ms, color 250ms, border-color 250ms',
					'transition-timing-function': 'ease-in-out',

					'&:not(:disabled):hover': {
						color: theme('colors.white'),
						'background-color': theme('colors.success.100'),
						'border-color': theme('colors.success.100'),
					},

					'&:disabled': {
						'box-shadow': 'none !important',
						'background-color': `${theme('colors.gray.400')} !important`,
						color: `${theme('colors.gray.800')} !important`,
					},
				},

				'.btn-error': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.white'),
					border: '2px solid transparent',
					'background-color': theme('colors.error.100'),
					transition: 'background-color 250ms ease-in-out',

					'&:not(:disabled):hover': {
						'background-color': theme('colors.error.200'),
					},
				},

				'.btn-error-outline': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.error.200'),
					'font-weight': '500',
					'background-color': 'transparent',
					border: `2px solid ${theme('colors.error.100')}`,
					transition: 'background-color 250ms, color 250ms, border-color 250ms',
					'transition-timing-function': 'ease-in-out',

					'&:not(:disabled):hover': {
						color: theme('colors.white'),
						'background-color': theme('colors.error.100'),
						'border-color': theme('colors.error.100'),
					},

					'&:disabled': {
						'box-shadow': 'none !important',
						'background-color': `${theme('colors.gray.400')} !important`,
						color: `${theme('colors.gray.800')} !important`,
					},
				},

				'.btn-secondary': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.white'),
					border: '2px solid transparent',
					'background-color': theme('colors.secondary.300'),
					transition: 'background-color 250ms ease-in-out',

					'&:not(:disabled):hover': {
						'background-color': theme('colors.secondary.400'),
					},
				},

				'.btn-secondary-outline': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.secondary.300'),
					'font-weight': '500',
					'background-color': 'transparent',
					border: `2px solid ${theme('colors.secondary.300')}`,
					transition: 'background-color 250ms, color 250ms, border-color 250ms',
					'transition-timing-function': 'ease-in-out',

					'&:not(:disabled):hover': {
						color: theme('colors.white'),
						'background-color': theme('colors.secondary.300'),
						'border-color': theme('colors.secondary.300'),
					},

					'&:disabled': {
						'box-shadow': 'none !important',
						'background-color': `${theme('colors.gray.400')} !important`,
						color: `${theme('colors.gray.800')} !important`,
					},
				},

				'.btn-warning': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.gray.1000'),
					border: '2px solid transparent',
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
					border: `2px solid ${theme('colors.warning.100')}`,
					transition: 'background-color 250ms, color 250ms, border-color 250ms',
					'transition-timing-function': 'ease-in-out',

					'&:not(:disabled):hover': {
						color: theme('colors.gray.1000'),
						'background-color': theme('colors.warning.100'),
						'border-color': theme('colors.warning.100'),
					},

					'&:disabled': {
						'box-shadow': 'none !important',
						'background-color': `${theme('colors.gray.400')} !important`,
						color: `${theme('colors.gray.800')} !important`,
					},
				},

				'.btn-choose': {
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
				},

				'.btn-choose-outline': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.primary.300'),
					'font-weight': '500',
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
						'background-color': `${theme('colors.gray.400')} !important`,
						color: `${theme('colors.gray.800')} !important`,
					},
				},

				'.btn-disabled': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.gray.700'),
					backgroundColor: 'rgba(140, 142, 151, 0.1)',
					transition:
						'color 250ms ease-in-out, background-color 250ms ease-in-out, border-color 250ms ease-in-out',
				},

				'.btn-disabled-outline': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.gray.800'),
					border: `1px solid ${theme('colors.gray.500')}`,
					transition: 'color 250ms ease-in-out, border-color 250ms ease-in-out',

					'&:not(:disabled):hover': {
						'border-color': theme('colors.gray.900'),
						color: theme('colors.gray.900'),
					},
				},

				'.btn-info-outline': {
					display: 'flex',
					'align-items': 'center',
					'justify-content': 'center',
					color: theme('colors.info.DEFAULT'),
					border: `1px solid ${theme('colors.info.DEFAULT')}`,
					transition:
						'color 250ms ease-in-out, background-color 250ms ease-in-out, border-color 250ms ease-in-out',

					'&:not(:disabled):hover': {
						'border-color': theme('colors.info.DEFAULT'),
						'background-color': theme('colors.info.DEFAULT'),
						color: theme('colors.white'),
					},
				},

				'.gray-box': {
					border: `1px solid ${theme('colors.gray.500')}`,
					'background-color': theme('colors.white'),

					'&:not(.rounded-sm)': {
						'border-radius': '8px',
					},
				},

				'.icon-hover': {
					color: theme('colors.gray.900'),
					transition: 'color 250ms',
					'-webkit-transition': 'color 250ms',

					'&:hover': {
						color: theme('colors.gray.800'),
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
						color: theme('colors.gray.1000'),
					},

					'.input': {
						'border-radius': '0.8rem',
						border: `1px solid ${theme('colors.gray.500')}`,
						height: '4.8rem',
						padding: '0 1.6rem',

						'&:focus-within': {
							'border-color': theme('colors.primary.300'),
						},

						'&:not(:focus-within):hover': {
							'border-color': `${theme('colors.gray.700')} !important`,
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
							'border-right': `1px solid ${theme('colors.gray.500')}`,
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
					color: theme('colors.gray.700'),

					'&::before': {
						border: `1px solid ${theme('colors.gray.700')}`,
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

				'.center': {
					left: '50%',
					top: '50%',
					transform: 'translate(-50%, -50%)',
				},

				'.input-group': {
					transition: 'border-color 200ms ease-in-out',
					'-webkit-transition': 'border-color 200ms ease-in-out',
					'-moz-transition': 'border-color 200ms ease-in-out',

					'&:not(.disabled)': {
						'&:focus-within,input:focus,textarea:focus,&.focus': {
							'border-color': theme('colors.primary.300'),

							'.flexible-placeholder': {
								color: theme('colors.primary.300'),
								top: '0',
								right: '1.25rem !important',
								'font-size': '1.2rem',
								transform: 'translateY(calc(-100% + 0.9rem))',
								'-webkit-transform': 'translateY(calc(-100% + 0.9rem))',
							},

							'.flexible-fieldset': {
								'border-color': theme('colors.primary.300'),

								legend: {
									'font-size': '1.2rem',
									'max-width': '100%',
									'-webkit-transition': 'max-width 500ms',
									transition: 'max-width 500ms',
								},
							},
						},
					},

					'&:not(:focus-within,.disabled):hover': {
						'border-color': theme('colors.gray.700'),

						'.flexible-fieldset': {
							'border-color': theme('colors.gray.700'),
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
					'pointer-events': 'none',
					color: theme('colors.gray.700'),
					transform: 'translateY(-50%)',
					'-webkit-transform': 'translateY(-50%)',
					transition: 'font-size 200ms, right 200ms, top 200ms, color 200ms, transform 200ms',
					'-webkit-transition': 'font-size 200ms, right 200ms, top 200ms, color 200ms, transform 200ms',

					'&.active': {
						color: theme('colors.gray.900'),
						top: '0',
						'font-size': '1.2rem',
						right: '1.25rem !important',
						transform: 'translateY(calc(-100% + 0.9rem))',
						'-webkit-transform': 'translateY(calc(-100% + 0.9rem))',

						'&.colorful': {
							color: theme('colors.primary.300'),
						},
					},
				},

				'.flexible-fieldset': {
					position: 'absolute',
					height: 'calc(100% + 5px)',
					inset: '-5px 0 0',
					'pointer-events': 'none',
					border: `1px solid ${theme('colors.input')}`,
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
						'border-color': theme('colors.primary.300'),
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
					border: `2px solid ${theme('colors.primary.200')}`,
					'border-right-color': 'rgba(0, 0, 0, 0)',
					'border-radius': '50%',
					animation: '750ms linear infinite spinner-border',
				},
			});
		}),
	],
};
export default config;
