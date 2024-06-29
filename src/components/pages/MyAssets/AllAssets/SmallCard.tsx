import { memo } from 'react';

interface SmallCardProps extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
	value: React.ReactNode;
	icon: React.ReactNode;
}
const SmallCard = ({ title, value, icon, style, ...props }: SmallCardProps) => (
	<div style={{ flex: '1 1 19.5%', minWidth: '20rem', height: '20.8rem', ...style }} {...props}>
		<div className='h-full flex-col gap-28 rounded py-8 text-center shadow-card flex-justify-center'>
			<div className='gap-8 text-lg text-light-gray-700 flex-items-center'>
				{icon}
				{title}
			</div>

			<svg width='146' height='27' viewBox='0 0 146 27' fill='none' xmlns='http://www.w3.org/2000/svg'>
				<path
					d='M1 25.2069C4.6 19.8436 8.73182 15.2662 14.0909 14.3262C19.45 13.3861 21.1886 21.0608 27.1818 19.8436C33.175 18.6264 35.6705 4.73736 40.2727 3.70236C44.875 2.66736 47.9023 9.68189 53.3636 9.27116C58.825 8.86042 61.0341 -0.476279 66.4545 1.61304C71.875 3.70236 73.9409 13.2595 79.5455 14.3947C85.15 15.5299 87.7477 9.15078 92.6364 9.83928C97.525 10.5278 100.205 18.2818 105.727 17.6204C111.25 16.959 113.336 2.57231 118.818 5.92173C124.3 9.27116 125.343 26.0104 131.909 24.8195C138.475 23.6285 142.3 9.27116 145 1'
					stroke='#00C288'
					stroke-linecap='round'
					stroke-linejoin='round'
				/>
				<path
					d='M27.1818 19.8346C21.1886 21.0513 19.45 13.3802 14.0909 14.3198C8.73182 15.2595 4.6 19.8346 1 25.1954V27H145V1C142.3 9.26722 138.475 23.6177 131.909 24.8081C125.343 25.9985 124.3 9.26722 118.818 5.91939C113.336 2.57156 111.25 16.9514 105.727 17.6125C100.205 18.2736 97.525 10.5233 92.6364 9.83508C87.7477 9.1469 85.15 15.523 79.5455 14.3883C73.9409 13.2537 71.875 3.70107 66.4545 1.61275C61.0341 -0.475577 58.825 8.85668 53.3636 9.26722C47.9023 9.67776 44.875 2.66657 40.2727 3.70107C35.6705 4.73558 33.175 18.618 27.1818 19.8346Z'
					fill='url(#paint0_linear_4249_76804)'
				/>
				<defs>
					<linearGradient
						id='paint0_linear_4249_76804'
						x1='73'
						y1='1'
						x2='73'
						y2='27'
						gradientUnits='userSpaceOnUse'
					>
						<stop stop-color='#05FF00' stop-opacity='0.19' />
						<stop offset='1' stop-color='#05FF00' stop-opacity='0' />
					</linearGradient>
				</defs>
			</svg>

			{value}
		</div>
	</div>
);

export default memo(SmallCard, (prevProps, nextProps) => prevProps.value !== nextProps.value);
