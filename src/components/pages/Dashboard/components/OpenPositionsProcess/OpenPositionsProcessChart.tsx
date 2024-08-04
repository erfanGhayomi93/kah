import { useGetOpenPositionProcessQuery } from '@/api/queries/dashboardQueries';
import { dateFormatter, numFormatter, sepNumbers } from '@/utils/helpers';
import { chart, type Chart, type SeriesSplineOptions } from 'highcharts/highstock';
import { useCallback, useEffect, useRef } from 'react';
import Suspend from '../../common/Suspend';

interface OpenPositionsProcessChartProps {
	interval: Dashboard.TInterval;
	type: Dashboard.GetOpenPositionProcess.TChartType;
}

const OpenPositionsProcessChart = ({ interval, type }: OpenPositionsProcessChartProps) => {
	const chartRef = useRef<Chart | null>(null);

	const { data, isLoading } = useGetOpenPositionProcessQuery({
		queryKey: ['getOpenPositionProcessQuery', interval, type],
	});

	const xAxisFormatter = (v: number | string): string => {
		return dateFormatter(v, interval === 'Today' ? 'time' : 'date');
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
				type: type === 'Aggregated' && (interval === 'Month' || interval === 'Year') ? 'logarithmic' : 'linear',
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
				color: type === 'Aggregated' ? 'rgb(0, 87, 255)' : 'rgb(0, 194, 136)',
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

		try {
			if (type === 'Aggregated') {
				series[0].data = (data as Dashboard.GetOpenPositionProcess.Aggregated[]).map(
					({ dateTime, openPosition }) => ({
						x: new Date(dateTime).getTime(),
						y: openPosition,
					}),
				);
			} else {
				for (let i = 0; i < data.length; i++) {
					try {
						const { dateTime, callOpenPosition, putOpenPosition } = data[
							i
						] as Dashboard.GetOpenPositionProcess.Separated;
						const x = new Date(dateTime).getTime();

						series[0].data!.push({ x, y: callOpenPosition });
						series[1].data!.push({ x, y: putOpenPosition });
					} catch (e) {
						//
					}
				}
			}
		} catch (e) {
			//
		}

		chartRef.current.series[0].update(series[0]);
		chartRef.current.series[1].update(series[1]);
	}, [data, type]);

	useEffect(() => {
		if (!chartRef.current) return;

		chartRef.current.xAxis[0].update({
			labels: {
				formatter: ({ value }) => xAxisFormatter(Number(value)),
			},
			crosshair: {
				label: {
					formatter: (value) => xAxisFormatter(value),
				},
			},
		});

		chartRef.current.yAxis[0].update({
			type: type === 'Aggregated' && (interval === 'Month' || interval === 'Year') ? 'logarithmic' : 'linear',
		});
	}, [interval]);

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
			<Suspend isLoading={isLoading} isEmpty={!data || Object.keys(data).length === 0} />
		</>
	);
};

export default OpenPositionsProcessChart;
