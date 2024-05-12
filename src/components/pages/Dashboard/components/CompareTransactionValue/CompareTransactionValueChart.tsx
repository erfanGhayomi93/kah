import { useGetOptionMarketComparisonQuery } from '@/api/queries/dashboardQueries';
import AppChart from '@/components/common/AppChart';
import { dateFormatter, toFixed } from '@/utils/helpers';
import { useMemo } from 'react';
import Suspend from '../../common/Suspend';

interface CompareTransactionValueChartProps {
	interval: Dashboard.TInterval;
	type: Dashboard.GetOptionMarketComparison.TChartType;
}

const CompareTransactionValueChart = ({ interval, type }: CompareTransactionValueChartProps) => {
	const { data, isLoading } = useGetOptionMarketComparisonQuery({
		queryKey: ['getOptionMarketComparisonQuery', interval, type],
	});

	const dataMapper: Array<{ x: string; y: number }> = useMemo(() => {
		if (!data) return [];

		const keys = Object.keys(data);
		if (keys.length === 0) return [];

		return keys.map((d) => ({
			x: d,
			y: data[d],
		}));
	}, [interval, data]);

	const COLORS: Record<Dashboard.GetOptionMarketComparison.TChartType, string[]> = {
		OptionToMarket: ['rgba(0, 87, 255, 1)'],
		OptionBuyToMarket: ['rgba(137, 118, 255, 1)'],
		OptionSellToMarket: ['rgba(68, 34, 140, 1)'],
	};

	return (
		<>
			<AppChart
				options={{
					colors: COLORS[type],
					tooltip: {
						y: {
							formatter: (val) => {
								return toFixed(val, 6, false) + '%';
							},
						},
					},
					xaxis: {
						tickAmount: 9,
						labels: {
							formatter: (value) => {
								return dateFormatter(value, interval === 'Today' ? 'time' : 'date');
							},
						},
					},
					yaxis: {
						labels: {
							formatter: (value) => {
								return String(Number((Number(value) * 100).toFixed(6)) * 1);
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

export default CompareTransactionValueChart;
