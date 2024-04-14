import { dateFormatter } from '@/utils/helpers';
import { useMemo } from 'react';
import Chart from 'react-apexcharts';

interface CompareTransactionValueChartProps {
	interval: Dashboard.TInterval;
	data: Dashboard.GetOptionMarketComparison.TChartData;
}

const CompareTransactionValueChart = ({ interval, data }: CompareTransactionValueChartProps) => {
	const dataMapper: Array<{ x: string; y: number }> = useMemo(() => {
		const keys = Object.keys(data);
		if (keys.length === 0) return [];

		return keys.map((d) => ({
			x: d,
			y: data[d],
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
				colors: ['rgba(0, 194, 136, 1)'],
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
							return dateFormatter(value, interval === 'Today' ? 'time' : 'date');
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
						formatter: (value) => {
							return String(Number(value) * 1);
						},
					},
				},
				dataLabels: {
					enabled: false,
				},
				markers: {
					size: 4,
					strokeColors: ['rgba(0, 194, 136, 1)'],
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
			type='area'
			width='100%'
			height='100%'
		/>
	);
};

export default CompareTransactionValueChart;
