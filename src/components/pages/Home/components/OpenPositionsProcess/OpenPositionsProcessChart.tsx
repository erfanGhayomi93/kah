import { useGetOpenPositionProcessQuery } from '@/api/queries/dashboardQueries';
import { dateFormatter, numFormatter, sepNumbers } from '@/utils/helpers';
import { useMemo } from 'react';
import Chart from 'react-apexcharts';
import Suspend from '../../common/Suspend';

interface OpenPositionsProcessChartProps {
	interval: Dashboard.TInterval;
}

const OpenPositionsProcessChart = ({ interval }: OpenPositionsProcessChartProps) => {
	const { data, isLoading } = useGetOpenPositionProcessQuery({
		queryKey: ['getOpenPositionProcessQuery', interval],
	});

	const dataMapper = useMemo<ApexAxisChartSeries>(() => {
		if (!data) return [];

		const keys = Object.keys(data);
		if (keys.length === 0) return [];

		const l = keys.length;
		const result: Array<{ data: Array<{ x: string; y: number }> }> = [
			{
				data: [],
			},
			{
				data: [],
			},
		];

		for (let i = 0; i < l; i++) {
			const datetime = keys[i];
			const value = data[datetime];

			result[0].data.push({
				x: datetime,
				y: value,
			});

			// result[1].data.push({
			// 	x: dateFormatter(datetime, 'time'),
			// 	y: value,
			// });
		}

		return result;
	}, [data]);

	const colors = ['rgba(0, 194, 136, 1)', 'rgba(255, 82, 109, 1)'];

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
								return sepNumbers(String(val ?? 0));
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
							formatter: (v) => {
								return dateFormatter(v, interval === 'Today' ? 'time' : 'date');
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
							bottom: 0,
							right: 0,
						},
					},
					stroke: {
						curve: 'smooth',
						width: 2,
					},
					fill: {
						type: 'solid',
					},
				}}
				series={dataMapper}
				type='line'
				width='100%'
				height='100%'
			/>

			<Suspend isLoading={isLoading} isEmpty={!data || Object.keys(data).length === 0} />
		</>
	);
};

export default OpenPositionsProcessChart;
