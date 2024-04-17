import { useGetMarketProcessChartQuery } from '@/api/queries/dashboardQueries';
import AppChart from '@/components/common/AppChart';
import { dateFormatter, numFormatter, sepNumbers } from '@/utils/helpers';
import { useMemo } from 'react';
import Suspend from '../../common/Suspend';

interface OptionMarketProcessChartProps {
	interval: Dashboard.TInterval;
	type: Dashboard.GetMarketProcessChart.TChartType;
}

const OptionMarketProcessChart = ({ interval, type }: OptionMarketProcessChartProps) => {
	const { data, isLoading } = useGetMarketProcessChartQuery({
		queryKey: ['getMarketProcessChartQuery', interval, type],
	});

	const dataMapper: Array<{ x: string; y: number }> = useMemo(() => {
		if (!data) return [];

		const keys = Object.keys(data);
		if (keys.length === 0) return [];

		return keys.map((d) => ({
			x: d,
			y: data[d] ?? 0,
		}));
	}, [interval, data]);

	return (
		<>
			<AppChart
				options={{
					colors: ['rgba(0, 194, 136, 1)'],
					tooltip: {
						y: {
							formatter: (val) => {
								return sepNumbers(String(val ?? 0));
							},
						},
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
				series={[
					{
						data: dataMapper,
					},
				]}
				type='area'
				width='100%'
				height='100%'
			/>

			<Suspend isLoading={isLoading} isEmpty={!data || Object.keys(data).length === 0} />
		</>
	);
};

export default OptionMarketProcessChart;
