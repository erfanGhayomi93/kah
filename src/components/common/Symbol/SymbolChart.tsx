import { dateFormatter, numFormatter, sepNumbers } from '@/utils/helpers';
import { useMemo } from 'react';
import AppChart from '../AppChart';

interface SymbolChartProps<T> extends Partial<ISymbolChartStates> {
	data: T[];
	height?: number | string;
	kindChart?: 'symbolChart' | 'openPosition' | 'nationalValue';
}

type TLinearChartResponse = Record<'x' | 'y', number>;
type TCandleChartResponse = [number, [number, number, number, number]];

const SymbolChart = <T,>({
	height,
	data,
	kindChart = 'symbolChart',
	type = 'area',
	interval = 'daily',
}: SymbolChartProps<T>) => {
	const dataMapper: TLinearChartResponse[] | TCandleChartResponse[] = useMemo(() => {
		if (!Array.isArray(data)) return [];
		if (type === 'area' && kindChart === 'symbolChart') {
			return data.map<TLinearChartResponse>((item) => ({
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				x: item.x,
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				y: item.c,
			}));
		}
		if (type === 'area' && kindChart === 'openPosition') {
			return data.map<TLinearChartResponse>((item) => ({
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				x: new Date(item.saveDate).getTime(),
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				y: item.openPosition,
			}));
		}
		if (type === 'area' && kindChart === 'nationalValue') {
			return data.map<TLinearChartResponse>((item) => ({
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				x: new Date(item.intervalDateTime).getTime(),
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				y: item.notionalValue,
			}));
		}

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		return data.map<TCandleChartResponse>((item) => [item.x, [item.o, item.h, item.l, item.c]]);
	}, [type, data, kindChart]);

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
