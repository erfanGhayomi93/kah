import { dateFormatter, numFormatter, sepNumbers } from '@/utils/helpers';
import { chart, type Chart, type GradientColorStopObject, type SeriesAreasplineOptions } from 'highcharts/highstock';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import LargeCard from './LargeCard';
import data from './data1.json';

interface IColor {
	line: string;
	steps: GradientColorStopObject[];
}

const PerformanceSummary = () => {
	const t = useTranslations('my_assets');

	const chartRef = useRef<Chart | null>(null);

	const [interval, setInterval] = useState('Today');

	const COLOR: IColor = {
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
			color: COLOR.line,
			lineColor: COLOR.line,
			fillColor: {
				linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
				stops: COLOR.steps,
			},
			threshold: null,
			type: 'areaspline',
			lineWidth: 1.5,
			connectNulls: true,
			data: data.map((item) => ({
				x: new Date(item.x).getTime(),
				y: item.y,
			})),
		};

		return result;
	}, [interval]);

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
		<LargeCard
			style={{ flex: '1 1 61%' }}
			title={t('performance_summary')}
			onTabChange={(v) => setInterval(v)}
			tabs={[
				{ id: 'Today', title: t('tab_day') },
				{ id: 'Week', title: t('tab_week') },
				{ id: 'Month', title: t('tab_month') },
				{ id: 'ThreeMonths', title: t('tab_3month') },
				{ id: 'Year', title: t('tab_year') },
			]}
		>
			<div ref={onLoad} className='flex-1' />
		</LargeCard>
	);
};

export default PerformanceSummary;
