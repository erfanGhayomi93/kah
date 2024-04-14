import { dateFormatter, divide, numFormatter } from '@/utils/helpers';
import { useMemo } from 'react';
import Chart from 'react-apexcharts';

interface OptionTradesValueChartProps {
	data: Dashboard.GetOptionTradeProcess.Data[];
	interval: Dashboard.TInterval;
	type: Dashboard.GetOptionTradeProcess.TChartType;
}

const OptionTradesValueChart = ({ data, interval, type }: OptionTradesValueChartProps) => {
	const dataMapper = useMemo<ApexAxisChartSeries>(() => {
		if (type === 'PutToCall') {
			const result = data.map((item) => ({
				x: dateFormatter(item.intervalDateTime, interval === 'Today' ? 'time' : 'date'),
				y: divide(item.putValue, item.callValue) * 100,
			}));

			return [
				{
					data: result,
				},
			];
		}

		const l = data.length;
		const result: Array<{ data: Array<{ x: string; y: number }> }> = [
			{
				data: [],
			},
			{
				data: [],
			},
		];
		for (let i = 0; i < l; i++) {
			const { intervalDateTime, callValue, putValue } = data[i];

			result[0].data.push({
				x: dateFormatter(intervalDateTime, interval === 'Today' ? 'time' : 'date'),
				y: callValue,
			});

			result[1].data.push({
				x: dateFormatter(intervalDateTime, interval === 'Today' ? 'time' : 'date'),
				y: putValue,
			});
		}

		return result;
	}, [type, interval, data]);

	const colors = type === 'Process' ? ['rgba(0, 194, 136, 1)', 'rgba(255, 82, 109, 1)'] : ['rgb(66, 115, 237)'];

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
				colors,
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
					strokeColors: colors,
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
					type: type === 'Process' ? 'solid' : 'gradient',
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
			}}
			series={dataMapper}
			type={type === 'Process' ? 'line' : 'area'}
			width='100%'
			height='100%'
		/>
	);
};

export default OptionTradesValueChart;
