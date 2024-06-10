import { dateFormatter, numFormatter, sepNumbers } from '@/utils/helpers';
import { useMemo } from 'react';
import AppChart from '../AppChart';

interface IChartData {
	data: Symbol.ChartData[];
	tab: 'symbol_chart';
	type: 'area' | 'candlestick';
}

interface IOpenPositionChart {
	data: Option.OpenPositionChart[];
	tab: 'open_positions';
	type: 'area';
}

interface INotionalValueChart {
	data: Option.NotionalValueChart[];
	tab: 'notional_value';
	type: 'area';
}

export type SymbolChartProps = (IChartData | IOpenPositionChart | INotionalValueChart) & {
	interval?: 'daily' | 'weekly' | 'monthly' | 'yearly';
	height?: number | string;
};

type TLinearChartResponse = Record<'x' | 'y', number>;
type TCandleChartResponse = [number, [number, number, number, number]];

const SymbolChart = ({ height, data, tab, type, interval = 'daily' }: SymbolChartProps) => {
	const dataMapper: TLinearChartResponse[] | TCandleChartResponse[] = useMemo(() => {
		try {
			if (!Array.isArray(data)) return [];

			if (type === 'candlestick')
				return data.map<TCandleChartResponse>((item) => [item.x, [item.o, item.h, item.l, item.c]]);

			if (tab === 'symbol_chart') return data.map<TLinearChartResponse>((item) => ({ x: item.x, y: item.c }));

			if (tab === 'open_positions')
				return data.map<TLinearChartResponse>((item) => ({
					x: new Date(item.saveDate).getTime(),
					y: item.openPosition,
				}));

			if (tab === 'notional_value')
				return data.map<TLinearChartResponse>((item) => ({
					x: new Date(item.intervalDateTime).getTime(),
					y: item.notionalValue,
				}));
		} catch (e) {
			//
		}

		return [];
	}, [type, data, tab]);

	const COLORS: Record<SymbolChartProps['tab'], string[]> = {
		symbol_chart: ['rgba(0, 87, 255, 1)'],
		open_positions: ['rgba(137, 118, 255, 1)'],
		notional_value: ['rgba(68, 34, 140, 1)'],
	};

	return (
		<AppChart
			options={{
				colors: COLORS[tab],
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
