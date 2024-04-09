import { isBetween, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './SymbolPriceSlider.module.scss';

interface IConfig {
	firstTradedPrice: 0;
	firstTradedPriceAsPercent: 0;
	lastTradedPrice: 0;
	lastTradedPriceAsPercent: 0;
	buySliderWidth: number;
	sellSliderWidth: number;
	lowestTradePriceOfTradingDayAsPercent: number;
	highestTradePriceOfTradingDayAsPercent: number;
	offsetLeft: number;
	offsetRight: number;
}

interface SymbolPriceSliderProps {
	onClick?: (price: number, percentage: number) => void;

	// lowThreshold | highThreshold
	thresholdData: [number, number];

	// lowestTradePriceOfTradingDay | highestTradePriceOfTradingDay
	boundaryData: [number, number];

	// firstTradedPrice | lastTradedPrice
	exchangeData: [number, number];

	yesterdayClosingPrice: number;
}

const SymbolPriceSlider = ({
	onClick,
	thresholdData,
	boundaryData,
	exchangeData,
	yesterdayClosingPrice,
}: SymbolPriceSliderProps) => {
	const borderRef = useRef<HTMLDivElement>(null);

	const tooltipRef = useRef<HTMLDivElement>(null);

	const rootRef = useRef<HTMLDivElement>(null);

	const [config, setConfig] = useState<IConfig>({
		firstTradedPrice: 0,
		firstTradedPriceAsPercent: 0,
		lastTradedPrice: 0,
		lastTradedPriceAsPercent: 0,
		buySliderWidth: 0,
		sellSliderWidth: 0,
		lowestTradePriceOfTradingDayAsPercent: 0,
		highestTradePriceOfTradingDayAsPercent: 0,
		offsetLeft: 0,
		offsetRight: 0,
	});

	const averageNumbers = useMemo(() => {
		try {
			const spacing = Math.round((thresholdData[1] - thresholdData[0]) / 6);

			const numbers: number[] = [thresholdData[0]];
			for (let i = 1; i < 6; i++) {
				numbers.push(thresholdData[0] + spacing * i);
			}

			numbers.push(thresholdData[1]);
			return numbers;
		} catch (e) {
			return [0, 0, 0, 0, 0];
		}
	}, [thresholdData]);

	const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		try {
			const rootElement = rootRef.current;
			if (!rootElement) return;

			const rootOffset = rootElement.getBoundingClientRect();

			const percentage = (e.clientX - rootOffset.left) / rootOffset.width;
			let price = Math.abs(
				Math.round((1 - percentage) * (thresholdData[1] - thresholdData[0]) - thresholdData[1]),
			);
			if (price > thresholdData[1]) price = thresholdData[1];
			else if (price < thresholdData[0]) price = thresholdData[0];
			const priceAsPercent =
				Number((((price - yesterdayClosingPrice) / yesterdayClosingPrice) * 100).toFixed(2)) * 1;

			onClick?.(price, priceAsPercent);
		} catch (e) {
			//
		}
	};

	const getSliderOffsets = (minValue: number, maxValue: number, priceFrom: number, priceTo: number) => {
		const sliderWidth = maxValue - minValue;
		const handleWidth = priceTo - priceFrom;
		const leftOffset = (priceFrom - minValue) / sliderWidth;
		const rightOffset = (maxValue - priceTo) / sliderWidth;
		const width = handleWidth / sliderWidth;

		return {
			width: Math.abs(width),
			left: Math.abs(leftOffset),
			right: Math.abs(rightOffset),
		};
	};

	const draw = () => {
		try {
			if (!borderRef.current) return;

			const instanceOfConfig: IConfig = {
				firstTradedPrice: 0,
				firstTradedPriceAsPercent: 0,
				lastTradedPrice: 0,
				lastTradedPriceAsPercent: 0,
				buySliderWidth: 0,
				sellSliderWidth: 0,
				lowestTradePriceOfTradingDayAsPercent: 0,
				highestTradePriceOfTradingDayAsPercent: 0,
				offsetLeft: 0,
				offsetRight: 0,
			};

			const borderWidth = borderRef.current.offsetWidth;
			const [lowThreshold, highThreshold] = thresholdData;
			const [lowestTradePriceOfTradingDay, highestTradePriceOfTradingDay] = boundaryData;

			// Calculate slider width
			const halfOfRootWidth = borderWidth / 2;

			if (boundaryData[0] <= yesterdayClosingPrice) {
				const sellOffsets = getSliderOffsets(
					lowThreshold,
					yesterdayClosingPrice,
					lowestTradePriceOfTradingDay < yesterdayClosingPrice
						? lowestTradePriceOfTradingDay
						: yesterdayClosingPrice,
					highestTradePriceOfTradingDay < yesterdayClosingPrice
						? highestTradePriceOfTradingDay
						: yesterdayClosingPrice,
				);
				instanceOfConfig.sellSliderWidth = halfOfRootWidth * sellOffsets.width;
				instanceOfConfig.offsetRight = halfOfRootWidth * sellOffsets.right;
			}

			if (boundaryData[1] >= yesterdayClosingPrice) {
				const buyOffsets = getSliderOffsets(
					yesterdayClosingPrice,
					highThreshold,
					lowestTradePriceOfTradingDay > yesterdayClosingPrice
						? lowestTradePriceOfTradingDay
						: yesterdayClosingPrice,
					highestTradePriceOfTradingDay > yesterdayClosingPrice
						? highestTradePriceOfTradingDay
						: yesterdayClosingPrice,
				);
				instanceOfConfig.buySliderWidth = halfOfRootWidth * buyOffsets.width;
				instanceOfConfig.offsetLeft = halfOfRootWidth * buyOffsets.left;
			}

			// Calculate (lowestTradePriceOfTradingDayAsPercent, highestTradePriceOfTradingDayAsPercent)
			instanceOfConfig.lowestTradePriceOfTradingDayAsPercent =
				Number(
					(((lowestTradePriceOfTradingDay - yesterdayClosingPrice) / yesterdayClosingPrice) * 100).toFixed(2),
				) * 1;
			instanceOfConfig.highestTradePriceOfTradingDayAsPercent =
				Number(
					(((highestTradePriceOfTradingDay - yesterdayClosingPrice) / yesterdayClosingPrice) * 100).toFixed(
						2,
					),
				) * 1;

			setConfig(instanceOfConfig);
		} catch (e) {
			//
		}
	};

	useEffect(() => {
		draw();
	}, [thresholdData, boundaryData, exchangeData, yesterdayClosingPrice, borderRef.current]);

	useEffect(() => {
		const eRoot = rootRef.current;
		if (!eRoot) return;

		eRoot.addEventListener('resize', () => draw());
	}, []);

	const dataIsAvailable = thresholdData[0] + thresholdData[1] > 0;

	return (
		<div className='px-4'>
			<div ref={rootRef} className={clsx(styles.root)}>
				<div role='presentation' ref={borderRef} className={styles.border} onClick={onMouseDown} />

				<div className={styles.tradedValues}>
					<div className={styles.inner}>
						<div
							style={{ transform: `translateX(${config.firstTradedPrice}px)` }}
							className={clsx('transition duration-300', styles.value)}
						>
							<svg
								width='1.2rem'
								height='1.5rem'
								viewBox='0 0 14 17'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M6.97656 11.0645L2.19958 6.43259L6.97656 1.80073L11.7535 6.43259L6.97656 11.0645Z'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
								<path
									d='M11.7535 11.2959L6.97656 15.9278L2.19959 11.2959'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
						</div>

						<div
							style={{ transform: `translateX(${config.lastTradedPrice}px)` }}
							className={clsx('transition duration-300', styles.value)}
						>
							<svg
								width='1.2rem'
								height='1.5rem'
								viewBox='0 0 14 17'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M6.97656 11.0645L2.19958 6.43259L6.97656 1.80073L11.7535 6.43259L6.97656 11.0645Z'
									fill='currentColor'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
								<path
									d='M11.7535 11.2959L6.97656 15.9278L2.19959 11.2959'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
						</div>
					</div>
				</div>

				<div ref={tooltipRef} style={{ opacity: '0' }} className={styles.tooltip}>
					<span className='text-xs font-medium' />
				</div>

				<div className={styles.sliders}>
					<div className={styles.sliderInner}>
						<div className={clsx(styles.section, styles.sell)}>
							<div
								style={{
									width: `${config.sellSliderWidth}px`,
									transform: `translateX(-${config.offsetRight}px)`,
								}}
								className={clsx('transition', styles.slider)}
							/>

							<div
								style={{
									transform: `translateX(${boundaryData[0] > yesterdayClosingPrice ? config.offsetLeft : -(config.sellSliderWidth + Math.abs(config.offsetRight))}px)`,
								}}
								className={clsx(
									'transition',
									styles.mark,
									boundaryData[0] > yesterdayClosingPrice && styles.buy,
								)}
							/>
						</div>

						<div className={clsx(styles.section, styles.buy)}>
							<div
								style={{
									width: `${config.buySliderWidth}px`,
									transform: `translateX(${config.offsetLeft}px)`,
								}}
								className={clsx('transition', styles.slider)}
							/>

							<div
								style={{
									transform: `translateX(${boundaryData[1] < yesterdayClosingPrice ? -config.offsetRight : config.buySliderWidth + Math.abs(config.offsetLeft)}px)`,
								}}
								className={clsx(
									'transition',
									styles.mark,
									boundaryData[1] < yesterdayClosingPrice && styles.sell,
								)}
							/>
						</div>
					</div>
				</div>

				<div className={styles.container}>
					<div
						style={{ left: 0 }}
						className={clsx(
							styles.div,
							dataIsAvailable && boundaryData[0] === averageNumbers[0] && styles.active,
						)}
					>
						<div className={styles.inner}>
							<span className={clsx(styles.rhombus)} />
							<span className={clsx(styles.line)} />
							<span
								style={{ paddingLeft: (sepNumbers(String(averageNumbers[0])).length - 1) * 5 }}
								className={clsx(styles.number)}
							>
								{sepNumbers(String(averageNumbers[0]))}
							</span>
						</div>
					</div>

					<div
						style={{ left: '16.667%' }}
						className={clsx(
							styles.div,
							dataIsAvailable &&
								isBetween(boundaryData[0], averageNumbers[1], boundaryData[1]) &&
								styles.active,
						)}
					>
						<div className={styles.inner}>
							<span className={clsx(styles.rhombus)} />
						</div>
					</div>

					<div
						style={{ left: '33.334%' }}
						className={clsx(
							styles.div,
							dataIsAvailable &&
								isBetween(boundaryData[0], averageNumbers[2], boundaryData[1]) &&
								styles.active,
						)}
					>
						<div className={styles.inner}>
							<span className={clsx(styles.rhombus)} />
						</div>
					</div>

					<div style={{ left: '50%' }} className={clsx(styles.div, styles.active)}>
						<div className={styles.inner}>
							<span className={clsx(styles.rhombus)} />
							<span className={clsx(styles.line)} />
							<span className={clsx(styles.number)}>{sepNumbers(String(yesterdayClosingPrice))}</span>
						</div>
					</div>

					<div
						style={{ left: '66.667%' }}
						className={clsx(
							styles.div,
							dataIsAvailable &&
								isBetween(boundaryData[0], averageNumbers[4], boundaryData[1]) &&
								styles.active,
						)}
					>
						<div className={styles.inner}>
							<span className={clsx(styles.rhombus)} />
						</div>
					</div>

					<div
						style={{ left: '83.334%' }}
						className={clsx(
							styles.div,
							dataIsAvailable &&
								isBetween(boundaryData[0], averageNumbers[5], boundaryData[1]) &&
								styles.active,
						)}
					>
						<div className={styles.inner}>
							<span className={clsx(styles.rhombus)} />
						</div>
					</div>

					<div
						style={{ left: '100%' }}
						className={clsx(
							styles.div,
							dataIsAvailable && boundaryData[1] === averageNumbers[6] && styles.active,
						)}
					>
						<div className={styles.inner}>
							<span className={clsx(styles.rhombus)} />
							<span className={clsx(styles.line)} />
							<span
								style={{ paddingRight: (sepNumbers(String(averageNumbers[6])).length - 1) * 5 }}
								className={clsx(styles.number)}
							>
								{sepNumbers(String(averageNumbers[6]))}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SymbolPriceSlider;
