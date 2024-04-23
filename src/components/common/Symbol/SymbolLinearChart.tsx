import { useSymbolChartDataQuery } from '@/api/queries/symbolQuery';
import dayjs from '@/libs/dayjs';
import { numFormatter, sepNumbers } from '@/utils/helpers';
import { useMemo } from 'react';
import Loading from '../../panels/SymbolInfoPanel/common/Loading';
import AppChart from '../AppChart';
import NoData from '../NoData';

interface SymbolLinearChartProps {
	symbolISIN: string;
	height?: number | string;
}

const SymbolLinearChart = ({ symbolISIN, height }: SymbolLinearChartProps) => {
	const { data, isLoading } = useSymbolChartDataQuery({
		queryKey: ['symbolChartDataQuery', symbolISIN, 'Today'],
	});

	const dateFormatter = (v: string | number) => {
		return dayjs(v).calendar('jalali').format('HH:mm');
	};

	const dataMapper: Array<Record<'x' | 'y', number>> = useMemo(() => {
		if (!Array.isArray(data)) return [];

		return data.map((item) => ({
			x: item.x,
			y: item.c,
		}));
	}, [data]);

	if (isLoading) return <Loading />;

	if (!Array.isArray(data) || data.length === 0) return <NoData />;

	return (
		<AppChart
			options={{
				colors: ['rgb(34, 180, 150)'],
				tooltip: {
					y: {
						formatter: (val) => {
							return sepNumbers(String(val ?? 0));
						},
					},
				},
				xaxis: {
					offsetX: 0,
					offsetY: 0,
					tickAmount: 7,
					axisBorder: {
						show: false,
					},
					axisTicks: {
						show: false,
					},
					labels: {
						formatter: (val) => {
							return dateFormatter(val);
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
			}}
			series={[
				{
					data: dataMapper,
				},
			]}
			type='area'
			width='100%'
			height={height}
		/>
	);
};

export default SymbolLinearChart;
