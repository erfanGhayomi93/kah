import { useGetOptionWatchlistPriceChangeInfoQuery } from '@/api/queries/dashboardQueries';
import { sepNumbers } from '@/utils/helpers';
import { chart, type Chart, type SeriesColumnOptions } from 'highcharts/highstock';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef } from 'react';
import Suspend from '../../common/Suspend';

const PriceChangesWatchlistChart = () => {
	const t = useTranslations('home');

	const chartRef = useRef<Chart | null>(null);

	const { data, isLoading } = useGetOptionWatchlistPriceChangeInfoQuery({
		queryKey: ['getOptionWatchlistPriceChangeInfoQuery'],
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
				outside: true,
				shared: true,
				followPointer: false,
				formatter: function () {
					return `‏${t('count')}: ${sepNumbers(String(this.y ?? 0))}`;
				},
			},
			xAxis: {
				type: 'category',
				crosshair: false,
			},
			yAxis: {
				min: 0,
				crosshair: false,
				gridLineWidth: 0,
				lineWidth: 0,
				labels: {
					enabled: false,
				},
			},
			plotOptions: {
				column: {
					pointWidth: 26,
					stacking: 'normal',
					borderRadius: 6,
					pointPadding: 0,
					borderWidth: 0,
					groupPadding: 0,
					grouping: false,
					shadow: false,
					dataLabels: {
						enabled: true,
						align: 'center',
						verticalAlign: 'top',
						y: -24,
						inside: false,
						style: {
							fontSize: '12px',
							fontWeight: '500',
						},
					},
				},
				series: {
					stacking: 'percent',
					color: 'red',
				},
			},
			series: [
				{ type: 'column', data: [] },
				{ type: 'column', data: [] },
			],
		});
	}, []);

	useEffect(() => {
		if (!chartRef.current || !data?.length) return;

		let maxValue = Math.max(...data.map((item) => item.count));
		maxValue = Math.max(Math.ceil(maxValue / 100) * 100, 10);

		const values = [
			data[0]?.count ?? 0,
			data[1]?.count ?? 0,
			data[2]?.count ?? 0,
			data[3]?.count ?? 0,
			data[4]?.count ?? 0,
			data[5]?.count ?? 0,
			data[6]?.count ?? 0,
		];

		const series: SeriesColumnOptions[] = [
			{
				type: 'column',
				enableMouseTracking: false,
				dataLabels: {
					enabled: false,
				},
				data: [
					{
						color: 'rgba(255, 82, 109, 0.1)',
						y: maxValue - values[0],
					},
					{
						color: 'rgba(255, 82, 109, 0.1)',
						y: maxValue - values[1],
					},
					{
						color: 'rgba(255, 82, 109, 0.1)',
						y: maxValue - values[2],
					},
					{
						color: 'rgba(226, 231, 237, 0.1)',
						y: maxValue - values[3],
					},
					{
						color: 'rgba(0, 194, 136, 0.1)',
						y: maxValue - values[4],
					},
					{
						color: 'rgba(0, 194, 136, 0.1)',
						y: maxValue - values[5],
					},
					{
						color: 'rgba(0, 194, 136, 0.1)',
						y: maxValue - values[6],
					},
				],
			},
			{
				type: 'column',
				dataLabels: {
					formatter: function () {
						if (!this.y) return '0%';
						return `${Math.round((this.y / maxValue) * 100)}%`;
					},
				},
				data: [
					{
						name: '< ‎-4',
						color: 'rgba(137, 68, 80, 1)',
						y: values[0],
					},
					{
						name: '‎-4 تا ‎-2',
						color: 'rgba(173, 67, 74, 1)',
						y: values[1],
					},
					{
						name: '‎-2 تا ‎-0.5',
						color: 'rgba(221, 62, 63, 1)',
						y: values[2],
					},
					{
						name: '‎+0.5 تا ‎-0.5',
						color: 'rgba(93, 96, 109, 1)',
						y: values[3],
					},
					{
						name: '‎+2 تا ‎+0.5',
						color: 'rgba(0, 194, 136, 1)',
						y: values[4],
					},
					{
						name: '‎+4 تا ‎+2',
						color: 'rgba(17, 137, 122, 1)',
						y: values[5],
					},
					{
						name: '‎+4 <',
						color: 'rgba(33, 110, 111, 1)',
						y: values[6],
					},
				],
			},
		];

		chartRef.current.update({ series });
	}, [data]);

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

export default PriceChangesWatchlistChart;
