import { dateFormatter, numFormatter } from '@/utils/helpers';
import { useMemo } from 'react';
import Chart from 'react-apexcharts';

interface MarketViewChartProps {
	interval: Dashboard.TInterval;
	data: Dashboard.GetIndex.All;
}

const MarketViewChart = ({ interval, data }: MarketViewChartProps) => {
	const dataMapper: Array<{ x: string; y: number }> = useMemo(() => {
		if (!Array.isArray(data)) return [];

		return data.map((item) => ({
			x: interval === 'Today' ? item.time : item.date,
			y: item.lastIndexValueInDay ?? 0,
		}));
	}, [interval, data]);

	return (
		<Chart
			options={{
				chart: {
					stacked: false,
					toolbar: {
						show: false,
					},
					foreColor: 'rgb(146, 145, 165)',
					zoom: {
						type: 'x',
						enabled: true,
						autoScaleYaxis: true,
					},
				},
				colors: ['rgb(66, 115, 237)'],
				tooltip: {
					cssClass: 'apex-tooltip',

					style: {
						fontFamily: 'IRANSans',
						fontSize: '1.2rem',
					},

					x: {
						show: false,
					},

					y: {
						title: {
							formatter: () => {
								return '';
							},
						},
					},
				},
				xaxis: {
					tickAmount: 9,
					offsetX: 0,
					offsetY: 0,
					axisBorder: {
						show: true,
					},
					axisTicks: {
						show: false,
					},
					labels: {
						rotate: 0,
						rotateAlways: false,
						style: {
							fontFamily: 'IRANSans',
							fontSize: '1.2rem',
						},
						formatter: (value) => {
							return interval === 'Today' ? value : dateFormatter(value, 'date');
						},
					},
				},
				yaxis: {
					tickAmount: 2,
					labels: {
						offsetX: -8,
						offsetY: 1,
						style: {
							fontFamily: 'IRANSans',
							fontSize: '1.2rem',
						},
						formatter: (val) => {
							return numFormatter(val);
						},
					},
				},
				dataLabels: {
					enabled: false,
				},
				markers: {
					size: 4,
					strokeColors: ['rgb(66, 115, 237)'],
					colors: 'rgb(255, 255, 255)',
					strokeWidth: 2,
					hover: {
						sizeOffset: 2,
					},
				},
				grid: {
					position: 'back',
					show: true,
					yaxis: {
						lines: {
							show: true,
						},
					},
					padding: {
						top: 0,
						left: 0,
						bottom: 0,
						right: 0,
					},
				},
				stroke: {
					curve: 'smooth',
					width: 2,
				},
			}}
			series={[
				{
					data: dataMapper,
				},
			]}
			type='line'
			width='100%'
			height='100%'
		/>
	);
};

export default MarketViewChart;
