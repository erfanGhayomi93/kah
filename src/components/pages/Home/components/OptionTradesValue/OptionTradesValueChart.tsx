import { useGetOptionTradeProcessQuery } from '@/api/queries/dashboardQueries';
import { dateFormatter, divide, numFormatter, sepNumbers, toFixed } from '@/utils/helpers';
import { useMemo } from 'react';
import Chart from 'react-apexcharts';
import Suspend from '../../common/Suspend';

interface OptionTradesValueChartProps {
	interval: Dashboard.TInterval;
	type: Dashboard.GetOptionTradeProcess.TChartType;
}

const OptionTradesValueChart = ({ interval, type }: OptionTradesValueChartProps) => {
	const { data, isLoading } = useGetOptionTradeProcessQuery({
		queryKey: ['getOptionTradeProcessQuery', interval],
	});

	const dataMapper = useMemo<ApexAxisChartSeries>(() => {
		if (!Array.isArray(data)) return [];

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
		<>
			<Chart
				options={{
					chart: {
						stacked: false,
						toolbar: {
							show: false,
						},
						zoom: {
							enabled: false,
						},
						animations: {
							dynamicAnimation: {
								enabled: true,
							},
							animateGradually: {
								enabled: false,
							},
							enabled: true,
							easing: 'linear',
							speed: 200,
						},
						foreColor: 'rgb(146, 145, 165)',
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
							formatter: (val) => {
								return type === 'PutToCall' ? `${toFixed(val)}%` : sepNumbers(String(val ?? 0));
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
							top: -16,
							left: 0,
							bottom: -8,
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

			<Suspend isLoading={isLoading} isEmpty={!data?.length} />
		</>
	);
};

export default OptionTradesValueChart;
