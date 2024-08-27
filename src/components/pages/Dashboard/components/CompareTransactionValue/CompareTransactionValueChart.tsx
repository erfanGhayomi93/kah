import { useGetOptionMarketComparisonQuery } from '@/api/queries/dashboardQueries';
import { useTheme } from '@/hooks';
import { getChartTheme } from '@/libs/highchart';
import { dateFormatter, getTickPositions, sepNumbers } from '@/utils/helpers';
import { chart, type Chart, type GradientColorStopObject, type SeriesAreasplineOptions } from 'highcharts/highstock';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import Suspend from '../../common/Suspend';

type TColors = Record<
	Dashboard.GetOptionMarketComparison.TChartType,
	{ line: string; steps: GradientColorStopObject[] }
>;

interface CompareTransactionValueChartProps {
	interval: Dashboard.TInterval;
	type: Dashboard.GetOptionMarketComparison.TChartType;
}

const CompareTransactionValueChart = ({ interval, type }: CompareTransactionValueChartProps) => {
	const chartRef = useRef<Chart | null>(null);

	const theme = useTheme();

	const { data, isLoading } = useGetOptionMarketComparisonQuery({
		queryKey: ['getOptionMarketComparisonQuery', interval, type],
	});

	const COLORS: TColors = {
		OptionToMarket: {
			line: 'rgba(0, 87, 255, 1)',
			steps: [
				[0, 'rgba(0, 87, 255, 0.2)'],
				[1, 'rgba(0, 87, 255, 0)'],
			],
		},
		OptionBuyToMarket: {
			line: 'rgba(137, 118, 255, 1)',
			steps: [
				[0, 'rgba(137, 118, 255, 0.2)'],
				[1, 'rgba(137, 118, 255, 0)'],
			],
		},
		OptionSellToMarket: {
			line: 'rgba(68, 34, 140, 1)',
			steps: [
				[0, 'rgba(68, 34, 140, 0.2)'],
				[1, 'rgba(68, 34, 140, 0)'],
			],
		},
	};

	const xAxisFormatter = (v: number | string): string => {
		return dateFormatter(v, interval === 'Today' ? 'time' : 'date');
	};

	const seriesData = useMemo(() => {
		if (!data) return [];

		const keys = Object.keys(data);
		if (keys.length === 0) return [];

		return keys.map((d) => ({
			x: new Date(d).getTime(),
			y: data[d],
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
					return `<span class="text-white">${sepNumbers(String(this.y ?? 0))}%</span>`;
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
				type: interval === 'Month' || interval === 'Year' ? 'logarithmic' : 'linear',
				labels: {
					formatter: ({ value }) => {
						return String(Number((Number(value) * 100).toFixed(6)) * 1);
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
			type: interval === 'Month' || interval === 'Year' ? 'logarithmic' : 'linear',
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
			<Suspend isLoading={isLoading} isEmpty={!data || Object.keys(data).length === 0} />
		</>
	);
};

export default CompareTransactionValueChart;
