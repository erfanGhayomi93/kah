import { dateFormatter, numFormatter, sepNumbers } from '@/utils/helpers';
import { useMemo } from 'react';
import AppChart from '../AppChart';

interface SymbolChartProps extends Partial<ISymbolChartStates> {
	data: Symbol.ChartData[];
	height?: number | string;
}

type TLinearChartResponse = Record<'x' | 'y', number>;
type TCandleChartResponse = [number, [number, number, number, number]];

const SymbolChart = ({ height, data, type = 'area', interval = 'daily' }: SymbolChartProps) => {
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
					tickAmount: 4,
					axisBorder: {
						show: false,
					},
					axisTicks: {
						show: false,
					},
					labels: {
						formatter: (val) => {
							if (isNaN(Number(val))) return '-';
							return dateFormatter(val + 1e3, interval === 'daily' ? 'time' : 'date');
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
			type={type}
			width='100%'
			height={height}
		/>
	);
};

export default SymbolChart;
