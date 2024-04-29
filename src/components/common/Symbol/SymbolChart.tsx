import dayjs from '@/libs/dayjs';
import { numFormatter, sepNumbers } from '@/utils/helpers';
import { useMemo } from 'react';
import AppChart from '../AppChart';

interface SymbolChartProps {
	type?: 'area' | 'candlestick';
	data: Symbol.ChartData[];
	height?: number | string;
}

type TLinearChartResponse = Record<'x' | 'y', number>;
type TCandleChartResponse = [number, [number, number, number, number]];

const SymbolChart = ({ height, data, type = 'area' }: SymbolChartProps) => {
	const dateFormatter = (v: string | number) => {
		return dayjs(v).calendar('jalali').format('HH:mm');
	};

	const dataMapper: TLinearChartResponse[] | TCandleChartResponse[] = useMemo(() => {
		if (!Array.isArray(data)) return [];
		if (type === 'area') {
			return data.map<TLinearChartResponse>((item) => ({
				x: item.x,
				y: item.c,
			}));
		}

		return data.map<TCandleChartResponse>((item) => [item.x, [item.o, item.h, item.l, item.c]]);
	}, [type, data]);

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
				chart: {
					animations: {
						enabled: false,
					},
				},
				plotOptions: {
					candlestick: {
						colors: {
							upward: 'rgba(0, 194, 136, 1)',
							downward: 'rgba(255, 82, 109, 1)',
						},
						wick: {
							useFillColor: true,
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
			type={type}
			width='100%'
			height={height}
		/>
	);
};

export default SymbolChart;
