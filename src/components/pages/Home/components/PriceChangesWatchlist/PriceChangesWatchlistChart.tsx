import { useMemo } from 'react';
import Chart from 'react-apexcharts';

interface PriceChangesWatchlistChartProps {
	data: Dashboard.GetOptionWatchlistPriceChangeInfo.Data[];
}

const COLORS = [
	'rgba(255, 0, 40, 1)',
	'rgba(255, 52, 84, 1)',
	'rgba(255, 82, 109, 1)',
	'rgba(226, 231, 237, 1)',
	'rgba(66, 218, 173, 1)',
	'rgba(0, 194, 136, 1)',
	'rgba(0, 164, 115, 1)',
];

const BG_COLORS = [
	'rgba(255, 0, 40, 0.05)',
	'rgba(255, 52, 84, 0.05)',
	'rgba(255, 82, 109, 0.05)',
	'rgba(226, 231, 237, 0.1)',
	'rgba(0, 194, 136, 0.05)',
	'rgba(0, 164, 115, 0.05)',
	'rgba(0, 164, 115, 0.05)',
];

const PriceChangesWatchlistChart = ({ data }: PriceChangesWatchlistChartProps) => {
	const dataMapper = useMemo<Array<{ x: string; fillColor: string; strokeColor: string; y: number }>>(() => {
		return data.map((item, i) => ({
			x: item.state,
			y: Math.max(0, Math.min(item.count, 100)),
			fillColor: COLORS[i],
			strokeColor: COLORS[i],
		}));
	}, [data]);

	return (
		<Chart
			options={{
				states: {
					active: {
						filter: {
							type: 'none',
						},
					},
					hover: {
						filter: {
							type: 'none',
						},
					},
				},
				chart: {
					stacked: false,
					toolbar: {
						show: false,
					},
					foreColor: 'rgb(146, 145, 165)',
					zoom: {
						enabled: false,
					},
				},
				plotOptions: {
					bar: {
						columnWidth: '32%',
						borderRadius: 6,
						colors: {
							backgroundBarColors: BG_COLORS,
							backgroundBarRadius: 6,
						},
						dataLabels: {
							position: 'top',
						},
					},
				},
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
				legend: {
					show: false,
				},
				xaxis: {
					tickAmount: 5,
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
					},
				},
				yaxis: {
					show: false,
					axisBorder: {
						show: false,
					},
					axisTicks: {
						show: false,
					},
					labels: {
						show: false,
						formatter: (value) => {
							return `${value}%`;
						},
					},
				},
				dataLabels: {
					textAnchor: 'middle',
					offsetY: -24,
					style: {
						colors: ['rgba(93, 96, 109, 1)'],
						fontWeight: 500,
						fontFamily: 'IRANSans',
						fontSize: '12px',
					},
					formatter: (value) => {
						return `${value}%`;
					},
				},
				grid: {
					show: false,
					padding: {
						top: 0,
						left: 0,
						bottom: 0,
						right: 0,
					},
				},
				stroke: {
					colors: ['rgb(255, 255, 255)'],
					curve: 'smooth',
					width: 2,
				},
				labels: [
					'< ‎-4',
					'‎-4 تا ‎-2',
					'‎-2 تا ‎-0.5',
					'‎+0.5 تا ‎-0.5',
					'‎+2 تا ‎+0.5',
					'‎+4 تا ‎+2',
					'‎+4 <',
				],
			}}
			series={[
				{
					data: dataMapper,
				},
			]}
			type='bar'
			width='100%'
			height='100%'
		/>
	);
};

export default PriceChangesWatchlistChart;
