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

const Group = styled.g`
	-webkit-filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
	filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
`;

const Text = styled.text`
	fill: currentColor;
	font: 500 1.4rem IRANSans;
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

	const movementHandler = (e: MouseEvent | React.MouseEvent, index: 0 | 1) => {
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

	const onClickRect = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		const circleFrom = circleFromRef.current;
		const circleTo = circleToRef.current;
		const eSvg = svgRef.current;
		if (!eSvg || !circleFrom || !circleTo) return;

		const { left: svgLeft } = eSvg.getBoundingClientRect();
		const { left: circleFromLeft } = circleFrom.getBoundingClientRect();
		const { left: circleToLeft } = circleTo.getBoundingClientRect();

		const pointerOffsetLeft = Math.abs(svgLeft - e.clientX);
		const circleFromOffsetLeft = Math.abs(circleFromLeft - svgLeft);
		const circleToOffsetLeft = Math.abs(circleToLeft - svgLeft);

		onMouseDown(
			e,
			Math.abs(circleFromOffsetLeft - pointerOffsetLeft) < Math.abs(circleToOffsetLeft - pointerOffsetLeft)
				? 0
				: 1,
		);
	};

	const onMouseDown = (e: React.MouseEvent, index: 0 | 1) => {
		try {
			e.preventDefault();

			const controller = new AbortController();

			window.addEventListener('mousemove', (e) => onMouseMove(e, index), {
				signal: controller.signal,
			});

			window.addEventListener('mouseup', (e) => onMouseUp(e, () => controller.abort()), {
				signal: controller.signal,
			});

			document.body.style.cursor = 'pointer';

			movementHandler(e, index);
		} catch (e) {
			//
		}
	};

	const onMouseMove = (e: MouseEvent, index: 0 | 1) => {
		movementHandler(e, index);
	};

	const onMouseUp = (e: MouseEvent, cb: () => void) => {
		try {
			e.preventDefault();
			e.stopPropagation();

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

	const x1Value = valueFormatter(Math.min(value[0], value[1]));

	const x1Text = Math.min(positionX.x1, positionX.x2 - x1Value.length * 2.5);

	const x2Value = valueFormatter(Math.max(value[0], value[1]));

	const x2Text = positionX.x2;

	return (
		<div className='px-8'>
			<svg
				ref={svgRef}
				width='100%'
				height='40'
				className='relative select-none overflow-visible ltr flex-justify-center'
			>
				<rect
					className='cursor-pointer'
					y='calc(50% - 2px)'
					width='100%'
					height='4'
					rx='2'
					fill='rgb(237, 238, 241)'
					onMouseDown={onClickRect}
				/>
				<rect
					ref={percentRef}
					x={`${Math.min(positionX.x2, positionX.x1)}%`}
					y='calc(50% - 2px)'
					width={`${Math.abs(positionX.x2 - positionX.x1)}%`}
					height='4'
					rx='2'
					className='pointer-events-none'
					fill='rgb(0, 87, 255)'
				/>

				<Group>
					<circle
						filter='url(#filter0_d_3025_28206)'
						cx={`${positionX.x1}%`}
						cy='50%'
						r='8'
						fill='rgb(255, 255, 255)'
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
				</Group>

				<Group>
					<circle
						filter='url(#filter0_d_3025_28206)'
						cx={`${positionX.x2}%`}
						cy='50%'
						r='8'
						fill='rgb(255, 255, 255)'
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
				</Group>

				<g className='text-gray-1000'>
					<Text x={`${x1Text}%`} y='5' textAnchor='middle'>
						{x1Value}
					</Text>

					{Array.isArray(labels) &&
						labels.map((label, index) => (
							<Text key={label} x={`${index === 0 ? 0 : 100 / index}%`} textAnchor='middle' y='40'>
								{label}
							</Text>
						))}

					<Text x={`${x2Text}%`} y='5' textAnchor='middle'>
						{x2Value}
					</Text>
				</g>
			</svg>
		</div>
	);
};

export default PriceSlider;
