import AppChart from '@/components/common/AppChart';
import { sepNumbers } from '@/utils/helpers';
import { useMemo } from 'react';

interface PerformanceChartProps {
	contracts: ISymbolStrategyContract[];
}

const PerformanceChart = ({ contracts }: PerformanceChartProps) => {
	const intrinsicValue = (strikePrice: number, baseSymbolPrice: number, type: TOptionSides) => {
		if (type === 'call') return Math.max(baseSymbolPrice - strikePrice, 0);
		return Math.max(strikePrice - baseSymbolPrice, 0);
	};

	const pnl = (intrinsicValue: number, premium: number, type: TBsSides) => {
		if (type === 'buy') return intrinsicValue - premium;
		return premium - intrinsicValue;
	};

	const dataMapper = useMemo(() => {
		const chartData: Array<Record<'x' | 'y', number>> = [];
		if (contracts.length === 0) return chartData;

		try {
			const l = contracts.length;
			const { baseSymbolPrice } = contracts[0].symbol.optionWatchlistData;
			const lowPrice = Math.max(baseSymbolPrice * 0.8, 0);
			const highPrice = baseSymbolPrice * 1.2;
			const n = (highPrice - lowPrice) / 10;

			for (let i = 0; i < l; i++) {
				const item = contracts[i];
				const contractType = item.symbol.symbolInfo.optionType === 'Call' ? 'call' : 'put';
				const {
					optionWatchlistData: { premium },
					symbolInfo: { strikePrice },
				} = item.symbol;

				let index = 0;
				for (let j = lowPrice; j <= highPrice; j += n) {
					const iv = intrinsicValue(strikePrice, j, contractType);
					const previousY = chartData[index]?.y ?? 0;
					const y = previousY + pnl(iv, premium, item.side);

					chartData[index] = {
						y,
						x: j,
					};

					index++;
				}
			}
		} catch (e) {
			//
		}

		return chartData;
	}, [JSON.stringify(contracts)]);

	console.log(dataMapper);

	return (
		<AppChart
			options={{
				colors: ['rgba(0, 87, 255, 1)'],
				chart: {
					zoom: {
						enabled: true,
					},
				},
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
					tickAmount: 5,
					axisBorder: {
						show: false,
					},
					axisTicks: {
						show: false,
					},
					labels: {
						formatter: (value) => sepNumbers(String(value)),
					},
				},
				yaxis: {
					tickAmount: 5,
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

export default PerformanceChart;
