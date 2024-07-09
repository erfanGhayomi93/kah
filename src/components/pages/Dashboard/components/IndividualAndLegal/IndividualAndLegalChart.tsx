import { useGetIndividualLegalInfoQuery } from '@/api/queries/dashboardQueries';
import { dateFormatter, numFormatter, sepNumbers } from '@/utils/helpers';
import { chart, type Chart, type SeriesSplineOptions } from 'highcharts/highstock';
import { useCallback, useEffect, useRef } from 'react';
import Suspend from '../../common/Suspend';

interface IndividualAndLegalChartProps {
	symbolType: Dashboard.GetIndividualLegalInfo.SymbolType;
	type: Dashboard.GetIndividualLegalInfo.Type;
}

const IndividualAndLegalChart = ({ symbolType, type }: IndividualAndLegalChartProps) => {
	const chartRef = useRef<Chart | null>(null);

	const { data, isLoading } = useGetIndividualLegalInfoQuery({
		queryKey: ['getIndividualLegalInfoQuery', symbolType, type],
	});

	const xAxisFormatter = (v: number | string): string => {
		return dateFormatter(v, 'time');
	};

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
					return `<span class="text-white">${sepNumbers(String(this.y ?? 0))}</span>`;
				},
			},
			xAxis: {
				type: 'datetime',
				crosshair: {
					label: {
						formatter: (value) => xAxisFormatter(value),
					},
				},
				labels: {
					formatter: ({ value }) => xAxisFormatter(value),
				},
			},
			yAxis: {
				tickAmount: 4,
				type: 'linear',
				labels: {
					formatter: ({ value }) => {
						return numFormatter(Number(value));
					},
				},
			},
			series: [
				{ type: 'spline', data: [] },
				{ type: 'spline', data: [] },
			],
		});
	}, []);

	useEffect(() => {
		if (!chartRef.current || !data?.length) return;

		const series: SeriesSplineOptions[] = [
			{
				color: 'rgb(0, 194, 136)',
				threshold: null,
				type: 'spline',
				lineWidth: 1.5,
				connectNulls: true,
				data: [],
			},
			{
				color: 'rgb(255, 82, 109)',
				threshold: null,
				type: 'spline',
				lineWidth: 1.5,
				connectNulls: true,
				data: [],
			},
		];

		for (let i = 0; i < data.length; i++) {
			const item = data[i];
			const dateTime = new Date(item.dateTime).getTime();
			const call = 'individualBuyAverage' in item ? item.individualBuyAverage : item.sumOfLegalsBuyVolume;
			const put = 'individualBuyAverage' in item ? item.individualSellAverage : item.sumOfLegalsSellVolume;

			series[0].data!.push({
				x: dateTime,
				y: call,
			});

			series[1].data!.push({
				x: dateTime,
				y: put,
			});
		}

		chartRef.current.update({ series });
	}, [data, symbolType, type]);

	useEffect(
		() => () => {
			if (chartRef.current) {
				chartRef.current.destroy();
				chartRef.current = null;
			}
		},
		[],
	);

	return (
		<>
			<div ref={onLoad} className='h-full' />

			<Suspend isLoading={isLoading} isEmpty={!data?.length} />
		</>
	);
};

export default IndividualAndLegalChart;
