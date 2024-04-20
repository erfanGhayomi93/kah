import AppChart from '@/components/common/AppChart';
import { dateFormatter, numFormatter, sepNumbers } from '@/utils/helpers';
import { useMemo } from 'react';

interface MarketViewChartProps {
	interval: Dashboard.TInterval;
	type: Dashboard.TIndex;
	data: Dashboard.GetIndex.All;
}

const MarketViewChart = ({ interval, type, data }: MarketViewChartProps) => {
	const dataMapper: Array<{ x: string; y: number }> = useMemo(() => {
		const result = data.map((item) => ({
			x: interval === 'Today' ? item.time : item.date,
			y: item.lastIndexValueInDay ?? 0,
		}));

		if (interval === 'Today') result.reverse();

		return result;
	}, [interval, data]);

	const COLORS: Record<Dashboard.TIndex, string[]> = {
		Overall: ['rgba(0, 87, 255, 1)'],
		EqualWeightOverall: ['rgba(137, 118, 255, 1)'],
		RetailTrades: ['rgba(137, 118, 255, 1)'],
	};

	return (
		<AppChart
			options={{
				colors: COLORS[type],
				tooltip: {
					y: {
						formatter: (val) => {
							return sepNumbers(String(val ?? 0));
						},
					},
				},
				xaxis: {
					tickAmount: 9,
					labels: {
						formatter: (value) => {
							return interval === 'Today' ? value : dateFormatter(value, 'date');
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
	);
};

export default MarketViewChart;
