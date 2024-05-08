import { useGetOptionTradeProcessQuery } from '@/api/queries/dashboardQueries';
import AppChart from '@/components/common/AppChart';
import { dateFormatter, divide, numFormatter, sepNumbers, toFixed } from '@/utils/helpers';
import { useMemo } from 'react';
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
			<AppChart
				options={{
					colors,
					tooltip: {
						y: {
							formatter: (val) => {
								return type === 'PutToCall' ? `${toFixed(val)}%` : sepNumbers(String(val ?? 0));
							},
						},
					},
					xaxis: {
						tickAmount: 5,
					},
					yaxis: {
						tickAmount: 4,
						labels: {
							formatter: (val) => {
								return numFormatter(val);
							},
						},
					},
					fill: {
						type: type === 'Process' ? 'solid' : 'gradient',
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
