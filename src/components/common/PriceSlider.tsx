import { useRef } from 'react';

type TValue = [number, number];

interface PriceSliderProps {
	showAvg?: boolean;
	value: TValue;
	min: number;
	max: number;
	onChange: (values: TValue) => void;
}

const PriceSlider = ({ min, max, value, showAvg = true, onChange }: PriceSliderProps) => {
	const svgRef = useRef<SVGSVGElement>(null);

	const avg = ((min + max) / 2 || 0).toFixed(0);

	return (
		<svg ref={svgRef} width='100%' height='40' className='relative ltr flex-justify-center'>
			<rect y='calc(50% - 2px)' width='100%' height='4' rx='2' fill='rgb(237, 238, 241)' />
			<rect x='0' y='calc(50% - 2px)' width='50%' height='4' rx='2' fill='rgb(0, 87, 255)' />
			<circle cx='6' cy='50%' r='6' fill='rgb(0, 87, 255)' />
			<circle cx='50%' cy='50%' r='6' fill='rgb(0, 87, 255)' />

			<g className='dark:text-dark-gray-800 text-gray-1000'>
				<text
					x='4'
					y='40'
					fontFamily='IRANSans'
					fontWeight='700'
					fontSize='12'
					textAnchor='middle'
					fill='currentColor'
				>
					{min}
				</text>
				{showAvg && (
					<text
						x='50%'
						y='40'
						fontFamily='IRANSans'
						fontWeight='700'
						fontSize='12'
						textAnchor='middle'
						fill='currentColor'
					>
						{avg}
					</text>
				)}
				<text
					x='100%'
					y='40'
					fontFamily='IRANSans'
					fontWeight='700'
					fontSize='12'
					textAnchor='end'
					fill='currentColor'
				>
					{max}
				</text>
			</g>
		</svg>
	);
};

export default PriceSlider;
