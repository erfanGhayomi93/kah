import num2persian from '@/utils/num2persian';
import { type Chart, chart, type SeriesPieOptions } from 'highcharts/highstock';
import { useCallback, useEffect, useMemo, useRef } from 'react';

interface OptionContractsChartProps {
	basis: Dashboard.GetOptionContractAdditionalInfo.Basis;
	type: Dashboard.GetOptionContractAdditionalInfo.Type;
	data?: Dashboard.GetOptionContractAdditionalInfo.All;
}

const OptionContractsChart = ({ type, basis, data }: OptionContractsChartProps) => {
	const chartRef = useRef<Chart | null>(null);

	const series: SeriesPieOptions = useMemo(() => {
		const result: SeriesPieOptions = {
			type: 'pie',
			data: [],
		};
		if (!data) return result;

		const fieldName = basis === 'Value' ? 'tradeValue' : 'tradeVolume';

		result.data = data.map((item, i) => ({
			name: String(i),
			y: item[fieldName],
		}));

		return result;
	}, [basis, type, data]);

	const colors =
		type === 'ContractType'
			? ['rgba(0, 194, 136, 1)', 'rgba(255, 82, 109, 1)']
			: ['rgba(0, 182, 237, 1)', 'rgba(0, 194, 136, 1)', 'rgba(255, 82, 109, 1)'];

	const onLoad = useCallback((el: HTMLDivElement | null) => {
		if (!el) return;

		chartRef.current = chart(el, {
			chart: {
				zooming: {
					mouseWheel: false,
					singleTouch: false,
				},
			},
			tooltip: {
				formatter: function () {
					return `<span class="text-white">\u200f${num2persian(String(this.y ?? 0))}</span>`;
				},
			},
			plotOptions: {
				pie: {
					size: '100%',
					innerSize: '60%',
					borderRadius: 2,
					slicedOffset: 16,
					borderWidth: 2,
					center: ['50%', '50%'],
					states: {
						hover: {
							shadow: false,
							halo: null,
						},
					},
				},
				series: {
					borderWidth: 0,
				},
			},
			colors,
			series: [series],
		});
	}, []);

	useEffect(() => {
		if (!chartRef.current) return;

		chartRef.current.series[0].update(series);
	}, [series]);

	useEffect(() => {
		if (!chartRef.current) return;

		chartRef.current.update({ colors });
	}, [type]);

	useEffect(
		() => () => {
			if (chartRef.current) {
				chartRef.current.destroy();
				chartRef.current = null;
			}
		},
		[],
	);

	return <div ref={onLoad} className='h-full flex-1' />;
};

export default OptionContractsChart;
