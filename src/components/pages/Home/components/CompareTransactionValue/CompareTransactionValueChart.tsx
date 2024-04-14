import { dateFormatter } from '@/utils/helpers';
import { useMemo } from 'react';
import Chart from 'react-apexcharts';

interface CompareTransactionValueChartProps {
	interval: Dashboard.TInterval;
	data: Dashboard.GetOptionMarketComparison.Data;
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
						fontSize: '12px',
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
						show: false,
					},
					axisTicks: {
						show: false,
					},
					labels: {
						rotate: 0,
						rotateAlways: false,
						style: {
							fontFamily: 'IRANSans',
							fontSize: '12px',
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
							fontSize: '12px',
						},
						formatter: (value) => {
							return String(Number((Number(value) * 100).toFixed(6)) * 1);
						},
					},
				},
				dataLabels: {
					enabled: false,
				},
				markers: {
					size: 0,
					strokeColors: ['rgba(0, 194, 136, 1)'],
					colors: 'rgb(255, 255, 255)',
					strokeWidth: 2,
					hover: {
						size: 4,
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
				fill: {
					type: 'gradient',
					gradient: {
						type: 'vertical',
						colorStops: [
							{
								offset: 20,
								color: 'rgb(0, 194, 136)',
								opacity: 0.2,
							},
							{
								offset: 100,
								color: 'rgb(0, 194, 136)',
								opacity: 0,
							},
						],
					},
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
