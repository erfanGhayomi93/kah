import { useGetOptionTradeProcessQuery } from '@/api/queries/dashboardQueries';
import { useTheme } from '@/hooks';
import { getChartTheme } from '@/libs/highchart';
import { dateFormatter, divide, numFormatter, sepNumbers } from '@/utils/helpers';
import { chart, type Chart, type SeriesAreasplineOptions } from 'highcharts/highstock';
import { useCallback, useEffect, useRef } from 'react';
import Suspend from '../../common/Suspend';

interface OptionTradesValueChartProps {
	interval: Dashboard.TInterval;
	type: Dashboard.GetOptionTradeProcess.TChartType;
}

const OptionTradesValueChart = ({ interval, type }: OptionTradesValueChartProps) => {
	const chartRef = useRef<Chart | null>(null);

	const theme = useTheme();

	const { data, isLoading } = useGetOptionTradeProcessQuery({
		queryKey: ['getOptionTradeProcessQuery', interval],
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
				type: type === 'PutToCall' && (interval === 'Month' || interval === 'Year') ? 'logarithmic' : 'linear',
				labels: {
					formatter: ({ value }) => {
						return numFormatter(Number(value));
					},
				},
			},
			series: [{ type: 'areaspline', data: [] }],
		});
	}, []);

	useEffect(() => {
		if (!chartRef.current || !data) return;

		try {
			if (type === 'PutToCall') {
				if (chartRef.current.series[1]) chartRef.current.series[1].remove();

				const series: SeriesAreasplineOptions = {
					color: 'rgb(66, 115, 237)',
					lineColor: 'rgb(66, 115, 237)',
					fillColor: {
						linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
						stops: [
							[0, 'rgb(66, 115, 237, 0.2)'],
							[1, 'rgb(66, 115, 237, 0)'],
						],
					},
					fillOpacity: 1,
					threshold: null,
					type: 'areaspline',
					lineWidth: 1.5,
					connectNulls: true,
					data: [],
				};

				series.data = data.map((item) => ({
					x: new Date(item.intervalDateTime).getTime(),
					y: Number((divide(item.putValue, item.callValue) * 100).toFixed(3)),
				}));

				chartRef.current.series[0].update(series);
			} else {
				const series: SeriesAreasplineOptions[] = [
					{
						color: 'rgba(0, 194, 136, 1)',
						lineColor: 'rgb(0, 194, 136)',
						fillColor: 'rgb(0, 0, 0, 0)',
						threshold: null,
						type: 'areaspline',
						lineWidth: 1.5,
						connectNulls: true,
						data: [],
					},
					{
						color: 'rgb(255, 82, 109)',
						lineColor: 'rgb(255, 82, 109)',
						fillColor: 'rgb(0, 0, 0, 0)',
						threshold: null,
						type: 'areaspline',
						lineWidth: 1.5,
						connectNulls: true,
						data: [],
					},
				];

				for (let i = 0; i < data.length; i++) {
					const { intervalDateTime, callValue, putValue } = data[i];
					const x = new Date(intervalDateTime).getTime();

					series[0].data!.push({
						x,
						y: callValue,
					});

					series[1].data!.push({
						x,
						y: putValue,
					});
				}

				chartRef.current.series[0].update(series[0]);
				if (chartRef.current.series[1]) chartRef.current.series[1].update(series[1]);
				else chartRef.current.addSeries(series[1]);
			}
		} catch (e) {
			//
		}
	}, [type, data]);

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
			type: type === 'PutToCall' && (interval === 'Month' || interval === 'Year') ? 'logarithmic' : 'linear',
		});
	}, [interval]);

	useEffect(() => {
		chartRef.current?.update(getChartTheme(theme));
	}, [theme]);

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

export default OptionTradesValueChart;
