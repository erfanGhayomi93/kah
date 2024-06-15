import { dateFormatter, numFormatter } from '@/utils/helpers';
import {
	type Chart,
	chart,
	type GradientColorStopObject,
	type SeriesAreaOptions,
	type SeriesCandlestickOptions,
} from 'highcharts/highstock';

import { CandleChartSVG, LinearChartSVG } from '@/components/icons';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import Radiobox from '../Inputs/Radiobox';
import Tooltip from '../Tooltip';

type TColors = Record<SymbolChartProps['tab'], { line: string; steps: GradientColorStopObject[] }>;

type TInterval = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface ChartIntervalProps {
	interval: TInterval;
	label: string;
	active: boolean;
	onChange: () => void;
}

interface SymbolChartIntervalProps {
	activeInterval: TInterval;
	onChange: (interval: TInterval) => void;
}

interface SymbolChartTypeProps {
	type: 'area' | 'candlestick';
	onChange: (type: 'area' | 'candlestick') => void;
}

interface IChartData {
	data: Symbol.ChartData[];
	tab: 'symbol_chart';
	type: 'area' | 'candlestick';
}

interface IOpenPositionChart {
	data: Option.OpenPositionChart[];
	tab: 'open_positions';
	type: 'area';
}

interface INotionalValueChart {
	data: Option.NotionalValueChart[];
	tab: 'notional_value';
	type: 'area';
}

export type SymbolChartProps = (IChartData | IOpenPositionChart | INotionalValueChart) & {
	interval?: TInterval;
	height?: number | string;
};

const SymbolChart = ({ height, data, tab, type, interval = 'daily' }: SymbolChartProps) => {
	const chartRef = useRef<Chart | null>(null);

	const COLORS: TColors = {
		symbol_chart: {
			line: 'rgba(0, 87, 255, 1)',
			steps: [
				[0, 'rgba(0, 87, 255, 0.2)'],
				[1, 'rgba(0, 87, 255, 0)'],
			],
		},
		open_positions: {
			line: 'rgba(137, 118, 255, 1)',
			steps: [
				[0, 'rgba(137, 118, 255, 0.2)'],
				[1, 'rgba(137, 118, 255, 0)'],
			],
		},
		notional_value: {
			line: 'rgba(68, 34, 140, 1)',
			steps: [
				[0, 'rgba(68, 34, 140, 0.2)'],
				[1, 'rgba(68, 34, 140, 0)'],
			],
		},
	};

	const series: SeriesCandlestickOptions | SeriesAreaOptions = useMemo(() => {
		if (type === 'candlestick') {
			const result: SeriesCandlestickOptions = {
				lineWidth: 1.5,
				type: 'candlestick',
				color: 'rgba(255, 82, 109, 1)',
				upColor: 'rgba(0, 194, 136, 1)',
				lineColor: 'rgba(255, 82, 109, 1)',
				upLineColor: 'rgba(0, 194, 136, 1)',
				data: [],
			};
			if (!Array.isArray(data)) return result;

			result.data = data!.map((item) => [item.x, item.o, item.h, item.l, item.c]); // x,open,high,low,close
			return result;
		}

		const result: SeriesAreaOptions = {
			color: COLORS[tab].line,
			lineColor: COLORS[tab].line,
			fillColor: {
				linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
				stops: COLORS[tab].steps,
			},
			type: 'area',
			lineWidth: 1.5,
			data: [],
		};

		if (!Array.isArray(data)) return result;

		if (tab === 'symbol_chart') result.data = data.map((item) => ({ x: item.x, y: item.c }));
		else if (tab === 'open_positions') {
			result.data = data.map((item) => ({
				x: new Date(item.saveDate).getTime(),
				y: item.openPosition,
			}));
		} else if (tab === 'notional_value') {
			result.data = data.map((item) => ({
				x: new Date(item.intervalDateTime).getTime(),
				y: item.notionalValue,
			}));
		}

		return result;
	}, [type, data, tab]);

	const onLoad = useCallback((el: HTMLDivElement | null) => {
		if (!el) return;

		chartRef.current = chart(el, {
			accessibility: {
				enabled: true,
			},
			chart: {
				height,
				zooming: {
					resetButton: {
						position: {
							x: -999,
							y: -999,
						},
					},
					mouseWheel: {
						enabled: true,
						type: 'x',
					},
					singleTouch: false,
				},
				panning: {
					enabled: true,
					type: 'x',
				},
			},
			subtitle: {
				text: '',
			},
			title: {
				text: '',
			},
			tooltip: {
				followTouchMove: true,
			},
			legend: {
				enabled: false,
			},
			credits: {
				enabled: false,
			},
			connectors: {
				enabled: false,
			},
			caption: {
				text: '',
			},
			xAxis: {
				type: 'datetime',
				lineColor: 'rgb(226, 231, 237)',
				endOnTick: false,
				startOnTick: false,
				showFirstLabel: true,
				showLastLabel: true,
				tickWidth: 0,
				maxPadding: 0,
				minPadding: 0,
				title: {
					text: '',
				},
				labels: {
					align: 'center',
					rotation: 0,
					style: {
						fontFamily: 'IRANSans',
						fontSize: '11',
						fontWeight: '400',
						color: 'rgba(93, 96, 109, 1)',
					},
					formatter: ({ value }) => {
						return dateFormatter(Number(value) + 1e3, interval === 'daily' ? 'time' : 'date');
					},
				},
			},
			yAxis: {
				type: 'logarithmic',
				tickAmount: 4,
				tickWidth: 0,
				showFirstLabel: true,
				showLastLabel: true,
				gridLineColor: 'rgb(226, 231, 237)',
				title: {
					text: '',
				},
				labels: {
					style: {
						fontFamily: 'IRANSans',
						fontSize: '11',
						fontWeight: '400',
						color: 'rgba(93, 96, 109, 1)',
					},
					formatter: ({ value }) => {
						return numFormatter(Number(value));
					},
				},
			},
			plotOptions: {
				area: {
					marker: {
						enabled: false,
					},
				},
			},
			series: [series],
		});
	}, []);

	useEffect(() => {
		if (!chartRef.current) return;

		chartRef.current.update({
			series: [series],
		});
	}, [series]);

	useEffect(() => {
		if (!chartRef.current) return;

		chartRef.current.update({
			xAxis: {
				labels: {
					formatter: ({ value }) => {
						return dateFormatter(Number(value) + 1e3, interval === 'daily' ? 'time' : 'date');
					},
				},
			},
		});
	}, [interval]);

	return <div ref={onLoad} className='h-full' />;
};

export const SymbolChartInterval = ({ activeInterval, onChange }: SymbolChartIntervalProps) => {
	const t = useTranslations('dates');

	return (
		<ul className='flex-1 gap-16 flex-items-start'>
			<ChartInterval
				interval='daily'
				label={t('daily')}
				active={activeInterval === 'daily'}
				onChange={() => onChange('daily')}
			/>

			<ChartInterval
				interval='weekly'
				label={t('weekly')}
				active={activeInterval === 'weekly'}
				onChange={() => onChange('weekly')}
			/>

			<ChartInterval
				interval='monthly'
				label={t('monthly')}
				active={activeInterval === 'monthly'}
				onChange={() => onChange('monthly')}
			/>

			<ChartInterval
				interval='yearly'
				label={t('yearly')}
				active={activeInterval === 'yearly'}
				onChange={() => onChange('yearly')}
			/>
		</ul>
	);
};

export const SymbolChartType = ({ type, onChange }: SymbolChartTypeProps) => {
	const t = useTranslations('symbol_info_panel');

	return (
		<div className='gap-8 flex-justify-end'>
			<Tooltip content={t('linear')}>
				<button
					onClick={() => onChange('area')}
					type='button'
					className={clsx(
						'size-24 rounded-sm transition-colors flex-justify-center',
						type === 'area' ? 'btn-primary' : 'bg-gray-500 text-gray-900',
					)}
				>
					<LinearChartSVG width='2rem' height='2rem' />
				</button>
			</Tooltip>
			<Tooltip content={t('candle')}>
				<button
					onClick={() => onChange('candlestick')}
					type='button'
					className={clsx(
						'size-24 rounded-sm transition-colors flex-justify-center',
						type === 'candlestick' ? 'btn-primary' : 'bg-gray-500 text-gray-900',
					)}
				>
					<CandleChartSVG width='2rem' height='2rem' />
				</button>
			</Tooltip>
		</div>
	);
};

export const ChartInterval = ({ interval, active, label, onChange }: ChartIntervalProps) => (
	<li className='gap-4 flex-items-center'>
		<Radiobox label={label} name={interval} checked={active} onChange={onChange} />
	</li>
);

export default SymbolChart;
