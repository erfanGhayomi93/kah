import AppChart from '@/components/common/AppChart';
import { sepNumbers, toFixed } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import PriceRange from './PriceRange';

interface PerformanceChartProps
	extends Pick<IAnalyzeModalInputs, 'minPrice' | 'maxPrice' | 'chartData' | 'baseAssets' | 'bep'> {
	onChange: (values: Partial<Pick<IAnalyzeModalInputs, 'minPrice' | 'maxPrice'>>) => void;
}

const PerformanceChart = ({ chartData, bep, baseAssets, maxPrice, minPrice, onChange }: PerformanceChartProps) => {
	const t = useTranslations();

	const getAnnotationStyle = (x: string, label: string, value: string, color: string, h: boolean) => ({
		x,
		strokeDashArray: 8,
		borderWidth: 2,
		borderColor: color,
		fillColor: color,
		label: {
			borderRadius: 4,
			borderWidth: 0,
			orientation: 'horizontal',
			text: `‎${value} :${label}`,
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

	const colors = ['rgb(0, 194, 136)', 'rgb(255, 82, 109)'];

	const [chunk1, chunk2] = useMemo<Array<typeof chartData>>(() => {
		const result: Array<typeof chartData> = [[], []];
		const l = chartData.length;

		for (let i = 0; i < l; i++) {
			const item = chartData[i];

			if (item) {
				if (item.y > 0) result[0].push(item);
				else if (item.y < 0) result[1].push(item);
			}
		}

		if (result[0].length > 1) {
			if (result[0][0].y > result[0][1].y) result[0].push(bep);
			else result[0].unshift(bep);
		}

		if (result[1].length > 1) {
			if (result[1][0].y > result[1][1].y) result[1].unshift(bep);
			else result[1].push(bep);
		}

		return result;
	}, [JSON.stringify(chartData), bep]);

	return (
		<div className='gap-8 flex-column'>
			<AppChart
				key='324'
				options={{
					colors,
					annotations: {
						xaxis: [
							getAnnotationStyle(
								String(bep.x),
								t('analyze_modal.break_even_point'),
								sepNumbers(String(bep.x)),
								'rgba(127, 26, 255, 1)',
								false,
							),
							getAnnotationStyle(
								String(baseAssets),
								t('analyze_modal.base_assets'),
								sepNumbers(String(baseAssets)),
								'rgba(0, 87, 255, 1)',
								true,
							),
						],
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
				series={[
					{
						type: 'area',
						data: chunk1,
					},
					{
						type: 'area',
						data: chunk2,
					},
				]}
				type='area'
				width='100%'
				height={304}
			/>

			<PriceRange maxPrice={maxPrice} minPrice={minPrice} onChange={onChange} />
		</div>
	);
};

export default PerformanceChart;
