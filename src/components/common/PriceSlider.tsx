import { useLayoutEffect, useRef } from 'react';

type TValue = [number, number];

interface PriceSliderProps {
	labels?: string[];
	value: TValue;
	min: number;
	max: number;
	step?: number;
	onChange: (value: number, type: 'start' | 'end') => void;
}

const CR = 6;

const PriceSlider = ({ min, max, step = 1, value, labels, onChange }: PriceSliderProps) => {
	const circleFromRef = useRef<SVGCircleElement>(null);

	const circleToRef = useRef<SVGCircleElement>(null);

	const percentRef = useRef<SVGRectElement>(null);

	const svgRef = useRef<SVGSVGElement>(null);

	const onMouseDown = (e: React.MouseEvent, index: 0 | 1) => {
		try {
			const controller = new AbortController();

			window.addEventListener('mousemove', (e) => onMouseMove(e, index), {
				signal: controller.signal,
			});

			window.addEventListener('mouseup', (e) => onMouseUp(e, () => controller.abort()), {
				signal: controller.signal,
			});

			document.body.style.cursor = 'pointer';
		} catch (e) {
			//
		}
	};

	const onMouseMove = (e: MouseEvent, index: 0 | 1) => {
		try {
			const eSvg = svgRef.current!;

			const { width: svgWidth, left: svgOffsetLeft } = eSvg.getBoundingClientRect();

			const positionX = Math.max(Math.min(e.clientX - svgOffsetLeft, svgWidth), 0);

			const value = min + (max - min) * (positionX / svgWidth);

			const roundedValue = Math.max(min, Math.min(max, min + Math.round((value - min) / step) * step));

			onChange(roundedValue, index === 0 ? 'start' : 'end');
		} catch (e) {
			//
		}
	};

	const onMouseUp = (e: MouseEvent, cb: () => void) => {
		try {
			cb();
			document.body.style.cursor = '';
		} catch (e) {
			//
		}
	};

	useLayoutEffect(() => {
		const eSVG = svgRef.current;
		const ePercent = percentRef.current;
		const eFrom = circleFromRef.current;
		const eTo = circleToRef.current;
		if (!eSVG || !eFrom || !eTo || !ePercent) return;

		const percent1 = Math.max(0, Math.min(((value[0] - min) / (max - min)) * 100, 100));
		const percent2 = Math.max(0, Math.min(((value[1] - min) / (max - min)) * 100, 100));

		eFrom.setAttribute('cx', `${percent1}%`);
		eTo.setAttribute('cx', `${percent2}%`);

		ePercent.setAttribute('x', `${Math.min(percent1, percent2)}%`);
		ePercent.setAttribute('width', `${Math.abs(percent2 - percent1)}%`);
	}, [value]);

	return (
		<div className='px-8'>
			<svg
				ref={svgRef}
				width='100%'
				height='40'
				className='relative select-none overflow-visible ltr flex-justify-center'
			>
				<rect y='calc(50% - 2px)' width='100%' height='4' rx='2' fill='rgb(237, 238, 241)' />
				<rect
					ref={percentRef}
					x='0px'
					y='calc(50% - 2px)'
					width='0px'
					height='4'
					rx='2'
					fill='rgb(0, 87, 255)'
				/>

				<circle
					ref={circleFromRef}
					cx='0px'
					cy='50%'
					r={CR}
					fill='rgb(0, 87, 255)'
					className='cursor-pointer'
					onMouseDown={(e) => onMouseDown(e, 0)}
				/>
				<circle
					ref={circleToRef}
					cx='0px'
					cy='50%'
					r={CR}
					fill='rgb(0, 87, 255)'
					className='cursor-pointer'
					onMouseDown={(e) => onMouseDown(e, 1)}
				/>

				{Array.isArray(labels) && (
					<g className='dark:text-dark-gray-800 text-gray-1000'>
						{labels.map((label, index) => (
							<text
								key={label}
								x={`${index === 0 ? 0 : 100 / index}%`}
								y='40'
								fontFamily='IRANSans'
								fontWeight='700'
								fontSize='12'
								textAnchor={index === 0 ? 'start' : index === label.length - 1 ? 'middle' : 'end'}
								fill='currentColor'
							>
								{label}
							</text>
						))}
					</g>
				)}
			</svg>
		</div>
	);
};

export default PriceSlider;
