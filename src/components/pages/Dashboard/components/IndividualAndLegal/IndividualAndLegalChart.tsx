import { useGetIndividualLegalInfoQuery } from '@/api/queries/dashboardQueries';
import AppChart from '@/components/common/AppChart';
import { dateFormatter, numFormatter, sepNumbers } from '@/utils/helpers';
import { useMemo } from 'react';
import Suspend from '../../common/Suspend';

interface IndividualAndLegalChartProps {
	symbolType: Dashboard.GetIndividualLegalInfo.SymbolType;
	type: Dashboard.GetIndividualLegalInfo.Type;
}

const IndividualAndLegalChart = ({ symbolType, type }: IndividualAndLegalChartProps) => {
	const { data, isLoading } = useGetIndividualLegalInfoQuery({
		queryKey: ['getIndividualLegalInfoQuery', symbolType, type],
	});

	const dataMapper: ApexAxisChartSeries = useMemo(() => {
		if (!data?.length) return [];

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
			const item = data[i];
			const dateTime = item.dateTime;
			const call = 'individualBuyAverage' in item ? item.individualBuyAverage : item.sumOfLegalsBuyVolume;
			const put = 'individualBuyAverage' in item ? item.individualSellAverage : item.sumOfLegalsSellVolume;

			result[0].data.push({
				x: dateTime,
				y: call,
			});

			result[1].data.push({
				x: dateTime,
				y: put,
			});
		}

		return result;
	}, [type, symbolType, data]);

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
					xaxis: {
						tickAmount: 5,
						labels: {
							formatter: (v) => {
								return dateFormatter(v, 'time');
							},
						},
					},
					yaxis: {
						labels: {
							formatter: (val) => {
								return numFormatter(val);
							},
						},
					},
					grid: {
						position: 'back',
						strokeDashArray: 24,
						show: true,
						yaxis: {
							lines: {
								show: true,
							},
						},
						xaxis: {
							lines: {
								show: true,
							},
						},
					},
				}}
				series={dataMapper}
				type='line'
				width='100%'
				height='100%'
			/>

			<Suspend isLoading={isLoading} isEmpty={!data?.length} />
		</>
	);
};

export default IndividualAndLegalChart;
