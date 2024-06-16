import { chartFontSetting } from '@/libs/highchart';
import { sepNumbers } from '@/utils/helpers';
import { type Chart, chart, type SeriesAreaOptions } from 'highcharts/highstock';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import NoData from '../NoData';
import PriceRange from './PriceRange';

interface AnalyzeChartProps extends IAnalyzeInputs {
	data: Array<Record<'x' | 'y', number>>;
	minPrice: number;
	maxPrice: number;
	height?: number;
	removeBorders?: boolean;
	onChange?: (values: Partial<Pick<IAnalyzeInputs, 'minPrice' | 'maxPrice'>>) => void;
}

const AnalyzeChart = ({
	data,
	baseAssets,
	maxPrice,
	minPrice,
	height,
	removeBorders = false,
	onChange,
}: AnalyzeChartProps) => {
	const t = useTranslations('analyze_modal');

	const chartRef = useRef<Chart | null>(null);

	const COLORS = {
		GREEN: 'rgb(0, 194, 136)',
		RED: 'rgb(255, 82, 109)',
	};

	const series: SeriesAreaOptions = useMemo(() => {
		const result: SeriesAreaOptions = {
			threshold: 1,
			type: 'area',
			lineWidth: 1.5,
			connectNulls: true,
			showInNavigator: true,
			data: [],
			zones: [
				{
					value: 0,
					color: COLORS.RED,
					fillColor: {
						linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
						stops: [
							[0, 'rgba(255, 82, 109, 0)'],
							[1, 'rgba(255, 82, 109, 0.2)'],
						],
					},
				},
				{
					color: COLORS.GREEN,
					fillColor: {
						linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
						stops: [
							[0, 'rgba(0, 194, 136, 0.2)'],
							[1, 'rgba(0, 194, 136, 0)'],
						],
					},
				},
			],
		};

		const diff = Math.round((maxPrice - minPrice) / 100);
		const l = data.length;

		for (let i = 0; i < l; i++) {
			const item = data[i];
			const pnl = Math.round(item.y);

			if (pnl === 0 || i % diff === 0) {
				result.data!.push({
					x: item.x,
					y: pnl,
				});
			}
		}

		return result;
	}, [data]);

	const onLoad = useCallback((el: HTMLDivElement | null) => {
		if (!el) return;

		chartRef.current = chart(el, {
			chart: {
				height,
			},
			tooltip: {
				useHTML: true,
				formatter: function () {
					const x = Number(this.x ?? 0);
					const y = Number(this.y ?? 0);

					const li1 = `<li style="height:18px;font-size:12px;font-weight:500;display:flex;justify-content:space-between;align-items:center;gap:16px;"><span>${t('base_symbol_price')}:</span><span class="ltr">${sepNumbers(String(x))}</span></li>`;
					const li2 = `<li style="height:18px;font-size:12px;font-weight:500;display:flex;justify-content:space-between;align-items:center;gap:16px;"><span>${t('current_base_price_distance')}:</span><span class="ltr">${sepNumbers(String(Math.abs(x - baseAssets)))}</span></li>`;
					const li3 = `<li style="height:18px;font-size:12px;font-weight:500;display:flex;justify-content:space-between;align-items:center;gap:16px;"><span>${t('rial_efficiency')}:</span><span class="ltr">${sepNumbers(String(y))}</span></li>`;
					const li4 = `<li style="height:18px;font-size:12px;font-weight:500;display:flex;justify-content:space-between;align-items:center;gap:16px;"><span>${t('ytm')}:</span><span class="ltr">${sepNumbers(String(0))} (0%)</span></li>`;

					return `<ul style="display:flex;flex-direction:column;gap:8px;direction:rtl">${li1}${li2}${li3}${li4}</ul>`;
				},
			},
			navigator: {
				enabled: true,
				outlineColor: 'rgb(226, 231, 237)',
				outlineWidth: 0,
				maskInside: true,
				height: 26,
				maskFill: 'rgba(24, 28, 47, 0.05)',
				xAxis: {
					type: 'datetime',
					gridLineWidth: 0,
				},
				handles: {
					backgroundColor: 'rgba(255, 255, 255, 1)',
					borderRadius: 6,
					height: 24,
					width: 21,
					lineWidth: 1,
					borderColor: 'rgba(226, 231, 237, 1)',
					symbols: ['url(/static/images/navigator.png)', 'url(/static/images/navigator.png)'],
				},
				series: {
					type: 'areaspline',
					xAxis: 0,
					zones: [
						{
							value: 0,
							color: 'rgba(226, 231, 237, 0.75)',
							fillColor: {
								linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
								stops: [
									[0, 'rgba(226, 231, 237, 0.75)'],
									[1, 'rgba(226, 231, 237, 0.75)'],
								],
							},
						},
						{
							color: 'rgba(226, 231, 237, 0.75)',
							fillColor: {
								linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
								stops: [
									[0, 'rgba(226, 231, 237, 0.75)'],
									[1, 'rgba(226, 231, 237, 0.75)'],
								],
							},
						},
					],
				},
			},
			xAxis: {
				type: 'datetime',
				crosshair: {
					label: {
						formatter: (value) => sepNumbers(String(value)),
					},
				},
				labels: {
					formatter: ({ value }) => sepNumbers(String(value)),
				},
			},
			yAxis: {
				type: 'linear',
				labels: {
					formatter: ({ value }) => {
						return sepNumbers(String(value));
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
			// @ts-expect-error: borderRadius has bug, it should be string, but it's number
			xAxis: {
				plotLines: [
					{
						dashStyle: 'LongDash',
						width: 1,
						color: 'rgba(0, 87, 255, 1)',
						value: baseAssets ?? 0,
						className: '!rounded-md',
						label: {
							text: `${t('base_assets')}: ${sepNumbers(String(baseAssets ?? 0))}`,
							align: 'center',
							textAlign: 'center',
							rotation: 0,
							verticalAlign: 'top',
							useHTML: true,
							style: {
								fontFamily: chartFontSetting.fontFamily,
								fontSize: '12px',
								fontWeight: 500,
								backgroundColor: 'rgba(0, 87, 255, 1)',
								borderRadius: '4px',
								color: 'rgb(255, 255, 255)',
								padding: '4px 8px',
							},
						},
					},
				],
			},
		});
	}, [baseAssets]);

	return (
		<ErrorBoundary>
			<div className='gap-8 flex-column'>
				<div ref={onLoad} />

				{onChange && <PriceRange maxPrice={maxPrice} minPrice={minPrice} onChange={onChange} />}

				{!series.data ||
					(series.data.length === 0 && (
						<div className='absolute size-full bg-white center'>
							<NoData text={t('no_active_contract_found')} />
						</div>
					))}
			</div>
		</ErrorBoundary>
	);
};

export default AnalyzeChart;
