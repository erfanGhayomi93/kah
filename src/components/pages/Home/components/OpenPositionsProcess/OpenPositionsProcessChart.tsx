import { useGetOpenPositionProcessQuery } from '@/api/queries/dashboardQueries';
import AppChart from '@/components/common/AppChart';
import { dateFormatter, numFormatter, sepNumbers } from '@/utils/helpers';
import { useMemo } from 'react';
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
			<AppChart
				options={{
					colors,
					tooltip: {
						y: {
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
						labels: {
							formatter: (v) => {
								return dateFormatter(v, interval === 'Today' ? 'time' : 'date');
							},
						},
					},
					yaxis: {
						tickAmount: 2,
						labels: {
							formatter: (val) => {
								return numFormatter(val);
							},
						},
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
