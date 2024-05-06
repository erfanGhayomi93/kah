import AppChart from '@/components/common/AppChart';
import { sepNumbers, toFixed } from '@/utils/helpers';
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
}

interface PerformanceChartProps
	extends Pick<IAnalyzeModalInputs, 'minPrice' | 'maxPrice' | 'chartData' | 'baseAssets'> {
	onChange: (values: Partial<Pick<IAnalyzeModalInputs, 'minPrice' | 'maxPrice'>>) => void;
}

const COLORS = {
	GREEN: 'rgba(0, 194, 136)',
	RED: 'rgb(255, 82, 109)',
};

const PerformanceChart = ({ chartData, baseAssets, maxPrice, minPrice, onChange }: PerformanceChartProps) => {
	const t = useTranslations();

	const [chartOptions, setChartOptions] = useState<IChartOptions>({
		series: [
			{
				data: [{ x: 0, y: 0, color: COLORS.GREEN }],
			},
		],
		annotations: [],
		colors: [COLORS.GREEN],
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
		};

		const diff = Math.round((maxPrice - minPrice) / 100);
		const l = chartData.length;
		let j = 0;
		let k = 0;

		for (let i = 0; i < l; i++) {
			const item = chartData[i];

			if (options.series[j] === undefined) {
				k = 0;
				options.series[j] = {
					data: [],
				};
			}

			if (k === 0 || k === l - 1 || k % diff === 0) {
				const color = item.y < 0 ? COLORS.RED : COLORS.GREEN;
				options.series[j].data.push({
					...item,
					color,
				});
			}

			if (item.y === 0) {
				options.annotations.push(
					getAnnotationStyle(
						item.x,
						t('analyze_modal.break_even_point'),
						String(item.x),
						'rgba(127, 26, 255, 1)',
					),
				);
				j++;
			}

			k++;
		}

		options.colors = options.series.reduce<string[]>((total, current) => [...total, current.data[0].color], []);
		setChartOptions(options);
	}, [JSON.stringify(chartData), maxPrice, minPrice]);

	const { series, annotations, colors } = chartOptions;

	return (
		<div className='gap-8 flex-column'>
			<AppChart
				options={{
					colors,
					annotations: {
						xaxis: annotations,
					},
					chart: {
						animations: {
							enabled: true,
							easing: 'linear',
							speed: 100,
						},
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
						min: minPrice,
						max: maxPrice,
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
						min: (min) => min,
						max: (max) => max,
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

			<PriceRange maxPrice={maxPrice} minPrice={minPrice} onChange={onChange} />
		</div>
	);
};

export default memo(PerformanceChart);
