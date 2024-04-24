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

			if (item.y >= 0) result[0].push(item);
			if (item.y <= 0) result[1].push(item);
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
								String(bep),
								t('analyze_modal.break_even_point'),
								sepNumbers(String(bep)),
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

							return '<div class="arrow_box">' + '<span>' + y + '</span>' + '</div>';
						},
					},
					xaxis: {
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
						min: (min) => min * 1.2,
						max: (max) => max * 1.2,
						tickAmount: 5,
						floating: false,
						labels: {
							formatter: (value) => toFixed(Number(value), 0),
						},
					},
					stroke: {
						curve: 'monotoneCubic',
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
