import { useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';

type TValue = [number, number];

interface PriceSliderProps {
	labels?: string[];
	value: TValue;
	min: number;
	max: number;
	step?: number;
	valueFormatter: (value: number) => string;
	onChange: (value: number, type: 'start' | 'end') => void;
}

const Text = styled.text`
	fill: currentColor;
	text-anchor: middle;
	font: 400 1.2rem IRANSans;

	text:first-child {
		text-anchor: end;
	}

	text:last-child {
		text-anchor: start;
	}
`;

const CR = 6;

const PriceSlider = ({ min, max, step = 1, value, labels, valueFormatter, onChange }: PriceSliderProps) => {
	const circleFromRef = useRef<SVGCircleElement>(null);

	const circleToRef = useRef<SVGCircleElement>(null);

	const percentRef = useRef<SVGRectElement>(null);

	const svgRef = useRef<SVGSVGElement>(null);

	const [positionX, setPositionX] = useState<Record<'x1' | 'x2', number>>({
		x1: 0,
		x2: 0,
	});

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
		const x1 = Math.max(0, Math.min(((value[0] - min) / (max - min)) * 100, 100));
		const x2 = Math.max(0, Math.min(((value[1] - min) / (max - min)) * 100, 100));

		setPositionX({
			x1,
			x2,
		});
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
					x={`${Math.min(positionX.x2, positionX.x1)}%`}
					y='calc(50% - 2px)'
					width={`${Math.abs(positionX.x2 - positionX.x1)}%`}
					height='4'
					rx='2'
					fill='rgb(0, 87, 255)'
				/>

				<circle
					ref={circleFromRef}
					cx={`${positionX.x1}%`}
					cy='50%'
					r={CR}
					fill='rgb(0, 87, 255)'
					className='cursor-pointer'
					onMouseDown={(e) => onMouseDown(e, 0)}
				/>

				<circle
					ref={circleToRef}
					cx={`${positionX.x2}%`}
					cy='50%'
					r={CR}
					fill='rgb(0, 87, 255)'
					className='cursor-pointer'
					onMouseDown={(e) => onMouseDown(e, 1)}
				/>

				<g className='text-gray-1000'>
					<Text x={`${positionX.x1}%`} y='40'>
						{valueFormatter(Math.min(value[0], value[1]))}
					</Text>

					{Array.isArray(labels) &&
						labels.map((label, index) => (
							<Text key={label} x={`${index === 0 ? 0 : 100 / index}%`} y='40'>
								{label}
							</Text>
						))}

					<Text x={`${positionX.x2}%`} y='40'>
						{valueFormatter(Math.max(value[0], value[1]))}
					</Text>
				</g>
			</svg>
		</div>
	);
};

export default PriceSlider;
