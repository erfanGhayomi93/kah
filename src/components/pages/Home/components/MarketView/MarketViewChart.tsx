import { numFormatter } from '@/utils/helpers';
import { useMemo } from 'react';
import Chart from 'react-apexcharts';

interface ChartProps {
	data: Dashboard.GetIndex.All | null;
}

const MarketViewChart = ({ data }: ChartProps) => {
	const dataMapper: Array<Record<'x' | 'y', string>> = useMemo(() => {
		if (!Array.isArray(data)) return [];

		const d = JSON.parse(JSON.stringify(data)) as typeof data;
		d.reverse();

		return d.map((item) => ({
			x: item.time,
			y: String(item.lastIndexValueInDay),
		}));
	}, [data]);

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
					style: {
						fontFamily: 'IRANSans',
						fontSize: '1.2rem',
					},
				},
				xaxis: {
					offsetX: 0,
					offsetY: 0,
					tickAmount: 7,
					axisBorder: {
						show: true,
					},
					axisTicks: {
						show: false,
					},
					labels: {
						style: {
							fontFamily: 'IRANSans',
							fontSize: '1.2rem',
						},
						formatter: (val) => {
							return val;
						},
					},
				},
				yaxis: {
					tickAmount: 4,
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
					size: 0,
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
					width: 1,
				},
			}}
			series={[
				{
					name: 'قیمت',
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
