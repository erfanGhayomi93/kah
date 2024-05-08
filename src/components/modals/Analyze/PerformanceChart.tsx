import AppChart from '@/components/common/AppChart';
import { divide, sepNumbers, toFixed } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { memo, useEffect, useState } from 'react';
import PriceRange from './PriceRange';

interface IAxisChartSeries {
	data: Array<{
		x: number | string;
		y: number | string;
		color: string;
	}>;
}

interface IChartOptions {
	series: IAxisChartSeries[];
	annotations: XAxisAnnotations[];
	colors: string[];
	offset: [number, number];
}

interface PerformanceChartProps {
	inputs: Pick<IAnalyzeModalInputs, 'minPrice' | 'maxPrice' | 'chartData' | 'baseAssets'>;
	onChange: (values: Partial<Pick<IAnalyzeModalInputs, 'minPrice' | 'maxPrice'>>) => void;
}

const COLORS = {
	GREEN: 'rgba(0, 194, 136)',
	RED: 'rgb(255, 82, 109)',
};

const PerformanceChart = ({ inputs, onChange }: PerformanceChartProps) => {
	const t = useTranslations();

	const [chartOptions, setChartOptions] = useState<IChartOptions>({
		series: [
			{
				data: [{ x: 0, y: 0, color: COLORS.GREEN }],
			},
		],
		annotations: [],
		colors: [COLORS.GREEN],
		offset: [0, 0],
	});

	const getAnnotationStyle = (x: number | string, label: string, value: string, color: string, h = false) => ({
		x,
		strokeDashArray: 8,
		borderWidth: 2,
		borderColor: color,
		fillColor: color,
		label: {
			borderRadius: 4,
			borderWidth: 0,
			orientation: 'horizontal',
			text: `‎${sepNumbers(value)} :${label}`,
			style: {
				background: color,
				color: 'rgb(255, 255, 255)',
				fontFamily: 'IRANSans',
				fontSize: '12px',
				cssClass: 'apex-annotation',
				padding: {
					top: 4,
					left: 8,
					bottom: 8,
					right: 8,
				},
			},
			offsetY: h ? 32 : 0,
		},
	});

	useEffect(() => {
		const { chartData, baseAssets, maxPrice, minPrice } = inputs;

		if (maxPrice - minPrice === 0) return;

		const options: IChartOptions = {
			annotations: [
				getAnnotationStyle(
					baseAssets,
					t('analyze_modal.base_assets'),
					String(baseAssets),
					'rgba(0, 87, 255, 1)',
					true,
				),
			],
			series: [],
			colors: [],
			offset: [0, 0],
		};

		const diff = Math.round((maxPrice - minPrice) / 100);
		const l = chartData.length;
		let closestPositive: null | Record<'x' | 'y', number> = null;
		let closestNegative: null | Record<'x' | 'y', number> = null;
		let hasBEP = false;
		let j = 0;
		let k = 0;

		for (let i = 0; i < l; i++) {
			const item = chartData[i];
			const pnl = item.y;

			if (options.series[j] === undefined) {
				k = 0;
				options.series[j] = {
					data: [],
				};
			}

			if (k === 0 || k === l - 1 || k % diff === 0 || pnl === 0) {
				const color = pnl < 0 ? COLORS.RED : COLORS.GREEN;

				if (k === 0 && j > 0) {
					options.series[j - 1].data.push({
						x: item.x,
						y: Math.round(item.y),
						color,
					});
				}

				options.series[j].data.push({
					x: item.x,
					y: Math.round(item.y),
					color,
				});
			}

			if (pnl === 0) {
				options.annotations.push(
					getAnnotationStyle(
						item.x,
						t('analyze_modal.break_even_point'),
						String(item.x),
						'rgba(127, 26, 255, 1)',
					),
				);

				hasBEP = true;
				j++;
			} else if (i > 0) {
				const previousItem = chartData[i - 1];

				if ((previousItem.y > 0 && pnl < 0) || (previousItem.y < 0 && pnl > 0)) {
					j++;
				}

				const absoluteValue = Math.abs(pnl);
				if (pnl >= 0 && (!closestPositive || absoluteValue < closestPositive.y)) {
					closestPositive = item;
				} else if (pnl < 0 && (!closestNegative || absoluteValue < Math.abs(closestNegative.y))) {
					closestNegative = item;
				}
			}

			if (pnl < options.offset[0]) options.offset[0] = pnl;
			else if (pnl > options.offset[1]) options.offset[1] = pnl;

			k++;
		}

		if (!hasBEP && closestPositive !== null && closestNegative !== null) {
			const xDiff = closestPositive.x - closestNegative.x;
			const x = divide(closestPositive.y - closestNegative.y, xDiff) * xDiff + closestNegative.x;

			hasBEP = true;
			options.annotations.push(
				getAnnotationStyle(x, t('analyze_modal.break_even_point'), String(x), 'rgba(127, 26, 255, 1)'),
			);
		}

		options.colors = options.series.reduce<string[]>((total, current) => [...total, current.data[0].color], []);

		options.offset[0] *= 1.5;
		options.offset[1] *= 1.5;

		setChartOptions(options);
	}, [JSON.stringify(inputs)]);

	const { series, annotations, colors } = chartOptions;

	return (
		<div className='gap-8 flex-column'>
			<AppChart
				options={{
					colors,
					annotations: {
						xaxis: annotations,
					},
					tooltip: {
						custom: ({ series, seriesIndex, dataPointIndex, w }) => {
							const y = series[seriesIndex][dataPointIndex];

							const li1 = `<li><span>${t('analyze_modal.base_symbol_price')}:</span><span class="ltr">${sepNumbers(String(y))}</span></li>`;
							const li2 = `<li><span>${t('analyze_modal.current_base_price_distance')}:</span><span class="ltr">${sepNumbers(String(4650))}</span></li>`;
							const li3 = `<li><span>${t('analyze_modal.rial_efficiency')}:</span><span class="ltr">${sepNumbers(String(1200))} (2.45%)</span></li>`;
							const li4 = `<li><span>${t('analyze_modal.ytm')}:</span><span class="ltr">${sepNumbers(String(125000))} (-2.6%)</span></li>`;

							return `<ul class="flex-column gap-8 *:h-18 *:text-tiny *:flex-justify-between *:font-medium *:flex-items-center *:gap-16 *:rtl">${li1}${li2}${li3}${li4}</ul>`;
						},
					},
					xaxis: {
						min: inputs.minPrice,
						max: inputs.maxPrice,
						offsetX: 0,
						offsetY: 0,
						tickAmount: 5,
						axisBorder: {
							show: false,
						},
						axisTicks: {
							show: false,
						},
						labels: {
							formatter: (value) => toFixed(Number(value), 0),
						},
					},
					yaxis: {
						min: chartOptions.offset[0] || undefined,
						max: chartOptions.offset[1] || undefined,
						tickAmount: 5,
						floating: false,
						labels: {
							formatter: (value) => toFixed(Number(value), 0),
						},
					},
					stroke: {
						curve: 'straight',
					},
					fill: {
						type: 'gradient',
						colors,
						gradient: {
							type: 'vertical',
							opacityFrom: 0.5,
							opacityTo: 0.5,
						},
					},
				}}
				series={series}
				type='area'
				width='100%'
				height={304}
			/>

			<PriceRange maxPrice={inputs.maxPrice} minPrice={inputs.minPrice} onChange={onChange} />
		</div>
	);
};

export default memo(PerformanceChart);
