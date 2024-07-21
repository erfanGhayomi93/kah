import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './RangeSlider.module.scss';

interface RangeSliderPropsType {
	min?: number;
	max: number;
	value: number;
	disabled?: boolean;
	step?: number;
	classes?: RecordClasses<
		| 'wrapper'
		| 'root'
		| 'border'
		| 'fillBorder'
		| 'text'
		| 'activeText'
		| 'circle'
		| 'activeCircle'
		| 'thumb'
		| 'tooltip'
		| 'disabled'
		| 'tooltipText'
		| 'tooltipBox'
	>;
	onChange: (value: number) => void;
}

const RangeSlider = ({ min = 0, max, value, step = 5, disabled = false, classes, onChange }: RangeSliderPropsType) => {
	const wrapperRef = useRef<HTMLDivElement>(null);

	const svgRef = useRef<SVGSVGElement | null>(null);

	const controller = useRef<AbortController | null>(null);

	const [valueAsPx, setValueAsPix] = useState(0);

	const clearEvents = () => {
		controller.current?.abort();
	};

	const handleMoveThumb = (e: MouseEvent | React.MouseEvent) => {
		if (disabled) return;

		try {
			const eSlider = wrapperRef.current;
			const eSVG = svgRef.current;
			if (!eSlider || !eSVG) return;

			const { width, left } = eSVG.getBoundingClientRect();

			let thumbOffsetFromLeft = Math.max(e.clientX - left, 0);
			if (thumbOffsetFromLeft < 0) thumbOffsetFromLeft = 0;
			else if (thumbOffsetFromLeft > width) thumbOffsetFromLeft = width;

			const value = min + (max - min) * (thumbOffsetFromLeft / width);

			const percent = ((value - min) / (max - min)) * 100 || 0;

			const roundedValue = Math.ceil(((Math.round(percent / step) * step) / 100) * (max - min) + min);

			onChange(Math.floor(Math.max(0, Math.min(max, roundedValue))));
		} catch (e) {
			//
		}
	};

	const onMouseUp = (e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		clearEvents();
	};

	const onMouseMove = (e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		handleMoveThumb(e);
	};

	const onClickTrack = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (disabled) return;

		controller.current = new AbortController();

		handleMoveThumb(e);

		window.addEventListener('mousemove', onMouseMove, {
			signal: controller.current.signal,
		});

		window.addEventListener('mouseup', onMouseUp, {
			signal: controller.current.signal,
		});
	};

	const onClickPercent = (v: number) => {
		if (disabled) return;
		onChange(Math.floor(v * max));
	};

	const valueAsPercent = useMemo(() => {
		const percent = ((value - min) / (max - min)) * 100 || 0;

		return Math.min(Math.max(0, percent), 100);
	}, [min, value, max, svgRef.current]);

	const onLoadSVG = useCallback((el: SVGSVGElement | null) => {
		if (!el) return;

		svgRef.current = el;

		const percent = Math.min(Math.max(0, ((value - min) / (max - min)) * 100 || 0), 100);
		const offsetWidth = el.getBoundingClientRect().width;

		setValueAsPix((offsetWidth / 100) * percent);
	}, []);

	useEffect(() => () => clearEvents(), []);

	useEffect(() => {
		const eSlider = wrapperRef.current;
		const eSVG = svgRef.current;
		if (!eSlider || !eSVG) return;

		const offset = eSlider.getBoundingClientRect();

		eSVG.setAttribute('width', String(offset.width));
	}, [wrapperRef.current, svgRef.current]);

	useEffect(() => {
		const eSVG = svgRef.current;
		if (!eSVG) return;

		const offset = eSVG.getBoundingClientRect();
		setValueAsPix((offset.width / 100) * valueAsPercent);
	}, [valueAsPercent]);

	return (
		<div
			ref={wrapperRef}
			className={clsx(styles.wrapper, classes?.wrapper, disabled && [styles.disabled, classes?.disabled])}
		>
			<svg ref={onLoadSVG} height='4rem' className={clsx('no-moveable', styles.root, classes?.root)}>
				<g>
					<rect
						onMouseDown={onClickTrack}
						rx='4'
						width='100%'
						height='6px'
						y='calc(10px - 2px)'
						className={clsx(styles.border, classes?.border)}
					/>
					<rect
						onMouseDown={onClickTrack}
						rx='4'
						width={`${valueAsPercent}%`}
						height='6px'
						y='calc(10px - 2px)'
						className={clsx('cursor-pointer', styles.fillBorder, classes?.fillBorder)}
					/>
				</g>

				<g>
					<circle
						r='2px'
						cx='4px'
						cy='11px'
						className={clsx(styles.circle, classes?.circle, styles.activeCircle, classes?.activeCircle)}
					/>
					<circle
						r='2px'
						cx='25%'
						cy='11px'
						strokeWidth='2'
						className={clsx(
							styles.circle,
							classes?.circle,
							valueAsPercent >= 25 && [styles.activeCircle, classes?.activeCircle],
						)}
					/>
					<circle
						r='2px'
						cx='50%'
						cy='11px'
						strokeWidth='2'
						className={clsx(
							styles.circle,
							classes?.circle,
							valueAsPercent >= 50 && [styles.activeCircle, classes?.activeCircle],
						)}
					/>

					<circle
						r='2px'
						cx='75%'
						cy='11px'
						strokeWidth='2'
						className={clsx(
							styles.circle,
							classes?.circle,
							valueAsPercent >= 75 && [styles.activeCircle, classes?.activeCircle],
						)}
					/>

					<circle
						r='2px'
						cx='calc(100% - 4px)'
						cy='11px'
						strokeWidth='2'
						className={clsx(
							styles.circle,
							classes?.circle,
							valueAsPercent === 100 && [styles.activeCircle, classes?.activeCircle],
						)}
					/>

					<circle
						onMouseDown={onClickTrack}
						r='6px'
						cx={`${Math.min(valueAsPercent, 100)}%`}
						cy='11px'
						strokeWidth='2'
						className={clsx(
							styles.thumb,
							classes?.thumb,
							styles.circle,
							classes?.circle,
							styles.activeCircle,
							classes?.activeCircle,
						)}
					/>
				</g>

				<g>
					<text
						onClick={() => onClickPercent(0)}
						x='0'
						y='32px'
						textAnchor='start'
						className={clsx(styles.text, classes?.text, styles.activeText, classes?.activeText)}
					>
						0%
					</text>
					<text
						onClick={() => onClickPercent(0.25)}
						x='25%'
						y='32px'
						textAnchor='middle'
						className={clsx(
							styles.text,
							classes?.text,
							valueAsPercent >= 25 && [styles.activeText, classes?.activeText],
						)}
					>
						25%
					</text>
					<text
						onClick={() => onClickPercent(0.5)}
						x='50%'
						y='32px'
						textAnchor='middle'
						className={clsx(
							styles.text,
							classes?.text,
							valueAsPercent >= 50 && [styles.activeText, classes?.activeText],
						)}
					>
						50%
					</text>
					<text
						onClick={() => onClickPercent(0.75)}
						x='75%'
						y='32px'
						textAnchor='middle'
						className={clsx(
							styles.text,
							classes?.text,
							valueAsPercent >= 75 && [styles.activeText, classes?.activeText],
						)}
					>
						75%
					</text>
					<text
						onClick={() => onClickPercent(1)}
						x='100%'
						y='32px'
						textAnchor='end'
						className={clsx(
							styles.text,
							classes?.text,
							valueAsPercent === 100 && [styles.activeText, classes?.activeText],
						)}
					>
						100%
					</text>
				</g>

				{!disabled && (
					<g
						transform={`translate(${valueAsPx - 16}, 20)`}
						className={clsx(styles.tooltip, classes?.tooltip)}
					>
						<path
							width='3.2rem'
							d='M0 4.23077C0 3.67848 0.447715 3.23077 1 3.23077H12.383C12.6499 3.23077 12.9057 3.12409 13.0935 2.93448L15.2895 0.717314C15.6808 0.322268 16.3192 0.322268 16.7105 0.717314L18.9065 2.93448C19.0943 3.12409 19.3501 3.23077 19.617 3.23077H31C31.5523 3.23077 32 3.67848 32 4.23077V23C32 23.5523 31.5523 24 31 24H1C0.447715 24 0 23.5523 0 23V4.23077Z'
							className={clsx(styles.tooltipBox, classes?.tooltipBox)}
						/>
						<text x='16px' y='18px' className={clsx(styles.tooltipText, classes?.tooltipText)}>
							{Math.floor(valueAsPercent)}%
						</text>
					</g>
				)}
			</svg>
		</div>
	);
};

export default RangeSlider;
