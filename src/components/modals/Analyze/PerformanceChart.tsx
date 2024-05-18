import AppChart from '@/components/common/AppChart';
import { divide, sepNumbers, toFixed } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { memo, useEffect, useState } from 'react';
import PriceRange from './PriceRange';

interface IPoint {
	x: number;
	y: number;
}

interface IAxisChartSeries {
	name?: string;
	type?: string;
	color?: string;
	group?: string;
	zIndex?: number;
	data: IPoint[];
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
	GREEN: 'rgb(0, 194, 136)',
	RED: 'rgb(255, 82, 109)',
};

const PerformanceChart = ({ inputs, onChange }: PerformanceChartProps) => {
	const t = useTranslations();

	const [chartOptions, setChartOptions] = useState<IChartOptions>({
		series: [
			{
				data: [{ x: 0, y: 0 }],
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

	const getBepByPoints = (point1: IPoint, point2: IPoint) => {
		const xDiff = point2.x - point1.x;
		const x = divide(point2.y - point1.y, xDiff) * xDiff + point1.x;

		return {
			x,
			y: 0,
		};
	};

	const getBepAnnotation = (target: IPoint) => {
		return getAnnotationStyle(
			target.x,
			t('analyze_modal.break_even_point'),
			String(target.x),
			'rgba(127, 26, 255, 1)',
		);
	};

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
		const bep: IPoint[] = [];
		let j = 0;
		let k = 0;

		const addBep = (point: IPoint) => {
			bep.push(point);
			options.series[j].data.push(point);
			options.annotations.push(getBepAnnotation(point));
		};

		for (let i = 0; i < l; i++) {
			const previousItem = chartData[i - 1];
			const item = chartData[i];
			const pnl = item.y;

			// Create new series
			if (options.series[j] === undefined) {
				const bepPoint = bep[bep.length - 1];
				k = 0;

				options.series[j] = {
					data: bepPoint ? [bepPoint] : [],
					type: 'area',
				};
			}

			// Add point
			if (pnl !== 0 && (k === 0 || k === l - 1 || k % diff === 0)) {
				options.series[j].data.push({
					x: item.x,
					y: Math.round(item.y),
				});
			}

			// Detect max/min
			if (pnl < options.offset[0]) options.offset[0] = pnl;
			else if (pnl > options.offset[1]) options.offset[1] = pnl;

			// Add break even point / Increase j / Change chart color
			if (pnl === 0) {
				addBep(getBepByPoints(previousItem, item));
				j++;
			} else if (i > 0) {
				if ((previousItem.y > 0 && pnl < 0) || (previousItem.y < 0 && pnl > 0)) {
					addBep(getBepByPoints(previousItem, item));
					j++;
				}
			}

			k++;
		}

		options.colors = options.series.reduce<string[]>(
			(total, { data }) => [...total, data[1].y < 0 ? COLORS.RED : COLORS.GREEN],
			[],
		);
		options.offset[0] *= 1.5;
		options.offset[1] *= 1.5;

		setChartOptions(options);
	}, [inputs]);

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
						custom: ({ seriesIndex, dataPointIndex, w }) => {
							const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

							const li1 = `<li><span>${t('analyze_modal.base_symbol_price')}:</span><span class="ltr">${sepNumbers(String(data.x ?? 0))}</span></li>`;
							const li2 = `<li><span>${t('analyze_modal.current_base_price_distance')}:</span><span class="ltr">${sepNumbers(String(Math.abs(data.x - inputs.baseAssets)))}</span></li>`;
							const li3 = `<li><span>${t('analyze_modal.rial_efficiency')}:</span><span class="ltr">${sepNumbers(String(data.y ?? 0))}</span></li>`;
							const li4 = `<li><span>${t('analyze_modal.ytm')}:</span><span class="ltr">${sepNumbers(String(0))} (0%)</span></li>`;

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
						floating: false,
						labels: {
							formatter: (value) => toFixed(Number(value), 0),
						},
					},
					stroke: {
						// ! Don't change this: monotoneCubic
						curve: 'monotoneCubic',
					},
					fill: {
						type: 'gradient',
						colors,
						gradient: {
							shadeIntensity: 0,
							opacityFrom: 0.7,
							opacityTo: 0.2,
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
