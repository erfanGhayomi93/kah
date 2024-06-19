import { useGetOpenPositionProcessQuery } from '@/api/queries/dashboardQueries';
import { dateFormatter, numFormatter, sepNumbers } from '@/utils/helpers';
import { chart, type Chart, type GradientColorStopObject, type SeriesAreasplineOptions } from 'highcharts/highstock';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import Suspend from '../../common/Suspend';

interface IColors {
	line: string;
	steps: GradientColorStopObject[];
}

interface OpenPositionsProcessChartProps {
	interval: Dashboard.TInterval;
}

const OpenPositionsProcessChart = ({ interval }: OpenPositionsProcessChartProps) => {
	const chartRef = useRef<Chart | null>(null);

	const { data, isLoading } = useGetOpenPositionProcessQuery({
		queryKey: ['getOpenPositionProcessQuery', interval],
	});

	const COLORS: IColors = {
		line: 'rgba(0, 87, 255, 1)',
		steps: [
			[0, 'rgba(0, 87, 255, 0.2)'],
			[1, 'rgba(0, 87, 255, 0)'],
		],
	};

	const xAxisFormatter = (v: number | string): string => {
		return dateFormatter(v, interval === 'Today' ? 'time' : 'date');
	};

	const series: SeriesAreasplineOptions = useMemo(() => {
		const result: SeriesAreasplineOptions = {
			color: COLORS.line,
			lineColor: COLORS.line,
			fillColor: {
				linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
				stops: COLORS.steps,
			},
			threshold: null,
			type: 'areaspline',
			lineWidth: 1.5,
			connectNulls: true,
			data: [],
		};

		if (!data?.length) return result;

		result.data = data.map(({ dateTime, openPosition }) => ({
			x: new Date(dateTime).getTime(),
			y: openPosition,
		}));

		return result;
	}, [interval, data]);

	const onLoad = useCallback((el: HTMLDivElement | null) => {
		if (!el) return;

		chartRef.current = chart(el, {
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
			series: [series],
		});
	}, []);

	useEffect(() => {
		if (!chartRef.current) return;

		chartRef.current.series[0].update(series);
	}, [series]);

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
	}, [interval]);

	return (
		<>
			<div ref={onLoad} className='h-full' />
			<Suspend isLoading={isLoading} isEmpty={!data || Object.keys(data).length === 0} />
		</>
	);
};

export default OpenPositionsProcessChart;
