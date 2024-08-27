import { useTheme } from '@/hooks';
import { getChartTheme } from '@/libs/highchart';
import { dateFormatter, getTickPositions, numFormatter, sepNumbers } from '@/utils/helpers';
import { chart, type Chart, type GradientColorStopObject, type SeriesAreasplineOptions } from 'highcharts/highstock';
import { useCallback, useEffect, useMemo, useRef } from 'react';

type TColors = Record<Dashboard.TIndex, { line: string; steps: GradientColorStopObject[] }>;

interface MarketViewChartProps {
	interval: Dashboard.TInterval;
	type: Dashboard.TIndex;
	data: Dashboard.GetIndex.Overall[] | Dashboard.GetIndex.EqualWeightOverall[] | Dashboard.GetIndex.RetailTrades;
}

const MarketViewChart = ({ interval, type, data }: MarketViewChartProps) => {
	const chartRef = useRef<Chart | null>(null);

	const COLORS: TColors = {
		Overall: {
			line: 'rgba(0, 87, 255, 1)',
			steps: [
				[0, 'rgba(0, 87, 255, 0.2)'],
				[1, 'rgba(0, 87, 255, 0)'],
			],
		},
		EqualWeightOverall: {
			line: 'rgba(137, 118, 255, 1)',
			steps: [
				[0, 'rgba(137, 118, 255, 0.2)'],
				[1, 'rgba(137, 118, 255, 0)'],
			],
		},
		RetailTrades: {
			line: 'rgba(68, 34, 140, 1)',
			steps: [
				[0, 'rgba(68, 34, 140, 0.2)'],
				[1, 'rgba(68, 34, 140, 0)'],
			],
		},
	};

	const theme = useTheme();

	const xAxisFormatter = (v: number | string): string => {
		return dateFormatter(v, interval === 'Today' ? 'time' : 'date');
	};

	const seriesData = useMemo(() => {
		if (Array.isArray(data)) {
			return data.map((item) => ({
				x: new Date(item.dateTime).getTime(),
				y: item.lastIndexValueInDay ?? 0,
			}));
		}

		return Object.keys(data).map((datetime) => ({
			x: new Date(datetime).getTime(),
			y: (data as Dashboard.GetIndex.RetailTrades)[datetime],
		}));
	}, [interval, data]);

	const getSeries = (): SeriesAreasplineOptions => ({
		color: COLORS[type].line,
		lineColor: COLORS[type].line,
		fillColor: {
			linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
			stops: COLORS[type].steps,
		},
		threshold: null,
		type: 'areaspline',
		lineWidth: 1.5,
		connectNulls: true,
		data: seriesData,
	});

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
				tickPositions: [],
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
				type:
					interval === 'Month' || interval === 'ThreeMonths' || interval === 'Year'
						? 'logarithmic'
						: 'linear',
				labels: {
					formatter: ({ value }) => {
						return numFormatter(Number(value));
					},
				},
			},
			series: [getSeries()],
		});
	}, []);

	useEffect(() => {
		if (!chartRef.current) return;

		chartRef.current.series[0].update(getSeries());
		chartRef.current.series[0].xAxis.update({ tickPositions: getTickPositions(seriesData) });
	}, [seriesData, type]);

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
			type: interval === 'Month' || interval === 'ThreeMonths' || interval === 'Year' ? 'logarithmic' : 'linear',
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

	return <div ref={onLoad} className='h-full' />;
};

export default MarketViewChart;
