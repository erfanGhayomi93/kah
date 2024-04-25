import dayjs from '@/libs/dayjs';
import { numFormatter, sepNumbers } from '@/utils/helpers';
import { useMemo } from 'react';
import AppChart from '../AppChart';

interface SymbolLinearChartProps {
	data: Symbol.ChartData[];
	height?: number | string;
}

const SymbolLinearChart = ({ height, data }: SymbolLinearChartProps) => {
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
					min: 0,
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
