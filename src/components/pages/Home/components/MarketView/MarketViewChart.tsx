import { dateFormatter, numFormatter, sepNumbers } from '@/utils/helpers';
import { useMemo } from 'react';
import Chart from 'react-apexcharts';

interface MarketViewChartProps {
	interval: Dashboard.TInterval;
	data: Dashboard.GetIndex.All;
}

const MarketViewChart = ({ interval, data }: MarketViewChartProps) => {
	const dataMapper: Array<{ x: string; y: number }> = useMemo(() => {
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
						formatter: (val) => {
							return sepNumbers(String(val ?? 0));
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
							return interval === 'Today' ? value : dateFormatter(value, 'date');
						},
					},
				},
				fill: {
					type: 'gradient',
					gradient: {
						type: 'vertical',
						colorStops: [
							{
								offset: 20,
								color: 'rgb(66, 115, 237)',
								opacity: 0.2,
							},
							{
								offset: 100,
								color: 'rgb(66, 115, 237)',
								opacity: 0,
							},
						],
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
						formatter: (val) => {
							return numFormatter(val);
						},
					},
				},
				dataLabels: {
					enabled: false,
				},
				markers: {
					size: 0,
					strokeColors: ['rgb(66, 115, 237)'],
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

export default MarketViewChart;
