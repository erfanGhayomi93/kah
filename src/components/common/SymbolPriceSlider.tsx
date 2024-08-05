import { isBetween, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './SymbolPriceSlider.module.scss';
import Tooltip from './Tooltip';

interface ISymbolPriceSliderConfig {
	firstTradedPrice: number;
	firstTradedPriceAsPercent: number;
	lastTradedPrice: number;
	lastTradedPriceAsPercent: number;
	buySliderWidth: number;
	sellSliderWidth: number;
	lowestTradePriceOfTradingDayAsPercent: number;
	highestTradePriceOfTradingDayAsPercent: number;
	offsetLeft: number;
	offsetRight: number;
}

interface SymbolPriceSliderProps {
	onClick?: (price: number) => void;

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
	const t = useTranslations('symbol_price_slider');

	const borderRef = useRef<HTMLDivElement>(null);

	// Tooltip
	const tooltipRef = useRef<HTMLDivElement>(null);
	const tooltipValueRef = useRef<HTMLDivElement>(null);
	const tooltipPercentRef = useRef<HTMLDivElement>(null);

	const rootRef = useRef<HTMLDivElement>(null);

	const [config, setConfig] = useState<ISymbolPriceSliderConfig>({
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

	const onMouseDown = (e: React.MouseEvent<HTMLElement>) => {
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

			onClick?.(price);
		} catch (e) {
			//
		}
	};

	const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
		try {
			const eTooltip = tooltipRef.current;
			const eTooltipValue = tooltipValueRef.current;
			const eTooltipPercent = tooltipPercentRef.current;
			const rootElement = rootRef.current;
			if (!eTooltip || !eTooltipValue || !eTooltipPercent || !rootElement) return;

			const rootOffset = rootElement.getBoundingClientRect();
			const tooltipOffset = eTooltip.getBoundingClientRect();

			/* Location */
			let left = e.clientX - rootOffset.left - tooltipOffset.width / 2;
			if (left < 0) left = 0;
			else if (left > rootOffset.width - tooltipOffset.width) left = rootOffset.width - tooltipOffset.width;
			eTooltip.style.transform = `translate(${left}px, -16px)`;

			/* Value */
			const percentage = (e.clientX - rootOffset.left) / rootOffset.width;
			let price = Math.abs(
				Math.round((1 - percentage) * (thresholdData[1] - thresholdData[0]) - thresholdData[1]),
			);
			if (price > thresholdData[1]) price = thresholdData[1];
			else if (price < thresholdData[0]) price = thresholdData[0];
			const priceAsPercent =
				Number((((price - yesterdayClosingPrice) / yesterdayClosingPrice) * 100).toFixed(2)) * 1;

			eTooltip.style.opacity = '1';
			eTooltipValue.textContent = sepNumbers(String(price ?? 0));
			eTooltipPercent.textContent = `(${priceAsPercent}%)`;

			if (priceAsPercent < 0) {
				eTooltipPercent.classList.remove('text-success-100');
				eTooltipPercent.classList.add('text-error-100');
			} else {
				eTooltipPercent.classList.remove('text-error-100');
				eTooltipPercent.classList.add('text-success-100');
			}
		} catch (e) {
			//
		}
	};

	const onMouseLeave = () => {
		try {
			const tooltipElement = tooltipRef.current;
			if (!tooltipElement) return;

			tooltipElement.style.opacity = '0';
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

			const instanceOfConfig = {
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
			const [firstTradedPrice, lastTradedPrice] = exchangeData;
			const [lowestTradePriceOfTradingDay, highestTradePriceOfTradingDay] = boundaryData;

			// Calculate (firstTradedPrice, lastTradedPrice)
			const maxMinusMin = highThreshold - lowThreshold;
			instanceOfConfig.firstTradedPrice =
				(1 - (highThreshold - firstTradedPrice) / maxMinusMin) * borderWidth - 5;
			if (instanceOfConfig.firstTradedPrice > borderWidth - 5)
				instanceOfConfig.firstTradedPrice = borderWidth - 5;
			instanceOfConfig.lastTradedPrice = (1 - (highThreshold - lastTradedPrice) / maxMinusMin) * borderWidth - 5;
			if (instanceOfConfig.lastTradedPrice < -5) instanceOfConfig.lastTradedPrice = -5;

			// Calculate (firstTradedPriceAsPercent, lastTradedPriceAsPercent)
			instanceOfConfig.firstTradedPriceAsPercent =
				Number((((firstTradedPrice - yesterdayClosingPrice) / yesterdayClosingPrice) * 100).toFixed(2)) * 1;
			instanceOfConfig.lastTradedPriceAsPercent =
				Number((((lastTradedPrice - yesterdayClosingPrice) / yesterdayClosingPrice) * 100).toFixed(2)) * 1;

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

			instanceOfConfig.firstTradedPrice = Math.min(
				Math.max(instanceOfConfig.firstTradedPrice, 0),
				borderWidth - 6,
			);
			instanceOfConfig.lastTradedPrice = Math.min(Math.max(instanceOfConfig.lastTradedPrice, 0), borderWidth - 6);

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
				<div
					role='presentation'
					ref={borderRef}
					className={styles.border}
					onClick={onMouseDown}
					onMouseMove={onMouseMove}
					onMouseLeave={onMouseLeave}
				/>

				<div className={styles.tradedValues}>
					<div className={styles.inner}>
						<Tooltip
							className={config.firstTradedPriceAsPercent >= 0 ? 'text-success-100' : 'text-error-100'}
							content={`${t('closing')}: ‎${sepNumbers(String(exchangeData[0] ?? 0))} (${config.firstTradedPriceAsPercent}%)`}
						>
							<div
								style={{ transform: `translate(${config.firstTradedPrice}px, 32px)` }}
								className={clsx('transition z-99 duration-300', styles.value)}
								onClick={() => onClick?.(exchangeData[0])}
							>
								<svg
									width='12px'
									height='16px'
									viewBox='0 0 13 16'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										d='M6.88362 9.71571L2.78906 5.6469L6.88362 1.57812L10.9781 5.6469L6.88362 9.71571Z'
										stroke='#5D606D'
										strokeWidth='2.4'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
									<path
										d='M10.9781 9.92188L6.88361 13.9907L2.78906 9.92188'
										stroke='#5D606D'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
								</svg>
							</div>
						</Tooltip>

						<Tooltip
							className={config.lastTradedPriceAsPercent >= 0 ? 'text-success-100' : 'text-error-100'}
							content={`${t('last')}: ‎${sepNumbers(String(exchangeData[1] ?? 0))} (${config.lastTradedPriceAsPercent}%)`}
						>
							<div
								onClick={() => onClick?.(exchangeData[1])}
								style={{ transform: `translate(${config.lastTradedPrice}px, 4px)` }}
								className={clsx('transition duration-300', styles.value)}
							>
								<svg
									width='12px'
									height='16px'
									viewBox='0 0 13 16'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										d='M6.30549 9.71571L2.21094 5.6469L6.30549 1.57812L10.4 5.6469L6.30549 9.71571Z'
										fill='#5D606D'
										stroke='#5D606D'
										strokeWidth='2.4'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
									<path
										d='M10.4 9.92188L6.30548 13.9907L2.21094 9.92188'
										stroke='#5D606D'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
								</svg>
							</div>
						</Tooltip>
					</div>
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

							<Tooltip
								content={`${t('low')}: ‎${sepNumbers(String(boundaryData[0] ?? 0))} (${config.lowestTradePriceOfTradingDayAsPercent}%)`}
							>
								<div
									onClick={() => onClick?.(boundaryData[0])}
									style={{
										transform: `translateX(${boundaryData[0] > yesterdayClosingPrice ? config.offsetLeft : -(config.sellSliderWidth + Math.abs(config.offsetRight))}px)`,
									}}
									className={clsx(
										'transition',
										styles.mark,
										boundaryData[0] > yesterdayClosingPrice && styles.buy,
									)}
								/>
							</Tooltip>
						</div>

						<div className={clsx(styles.section, styles.buy)}>
							<div
								style={{
									width: `${config.buySliderWidth}px`,
									transform: `translateX(${config.offsetLeft}px)`,
								}}
								className={clsx('transition', styles.slider)}
							/>

							<Tooltip
								content={`${t('high')}: ‎${sepNumbers(String(boundaryData[1] ?? 0))} (${config.highestTradePriceOfTradingDayAsPercent}%)`}
							>
								<div
									onClick={() => onClick?.(boundaryData[1])}
									style={{
										transform: `translateX(${boundaryData[1] < yesterdayClosingPrice ? -config.offsetRight : config.buySliderWidth + Math.abs(config.offsetLeft)}px)`,
									}}
									className={clsx(
										'transition',
										styles.mark,
										boundaryData[1] < yesterdayClosingPrice && styles.sell,
									)}
								/>
							</Tooltip>
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
						style={{ left: '50%' }}
						className={clsx(
							styles.div,
							dataIsAvailable &&
								isBetween(boundaryData[0], yesterdayClosingPrice, boundaryData[1]) &&
								styles.active,
						)}
					>
						<div className={styles.inner}>
							<span className={clsx(styles.rhombus)} />
							<span className={clsx(styles.line)} />
							<span className={clsx(styles.number)}>{sepNumbers(String(yesterdayClosingPrice))}</span>
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

				<div
					ref={tooltipRef}
					style={{ opacity: '0' }}
					className='pointer-events-none absolute left-0 top-0 z-10'
				>
					<div data-placement='top' className='tippy-box'>
						<div className='tippy-content text-tiny font-medium ltr'>
							<span ref={tooltipValueRef} />
							<span ref={tooltipPercentRef} className='pl-4' />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SymbolPriceSlider;
