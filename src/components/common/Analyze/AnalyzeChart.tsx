import { chartFontSetting } from '@/libs/highchart';
import { sepNumbers, toFixed } from '@/utils/helpers';
import { type Chart, chart, type SeriesAreaOptions, type XAxisPlotLinesOptions } from 'highcharts/highstock';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import NoData from '../NoData';
import PriceRange from './PriceRange';

interface IPoint {
	x: number;
	y: number;
}

interface AnalyzeChartProps extends IAnalyzeInputs {
	data: IPoint[];
	minPrice: number;
	maxPrice: number;
	height?: number;
	compact?: boolean;
	onChange?: (values: Partial<Pick<IAnalyzeInputs, 'minPrice' | 'maxPrice'>>) => void;
}

const AnalyzeChart = ({
	data,
	baseAssets,
	maxPrice,
	minPrice,
	height,
	compact = false,
	onChange,
}: AnalyzeChartProps) => {
	const t = useTranslations('analyze_modal');

	const chartRef = useRef<Chart | null>(null);

	const COLORS = {
		GREEN: 'rgb(0, 194, 136)',
		RED: 'rgb(255, 82, 109)',
	};

	const getAreaSeries = (): SeriesAreaOptions => ({
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
	});

	const getBepPlotLine = (v: number, y: number): XAxisPlotLinesOptions => ({
		dashStyle: 'LongDash',
		width: 1.5,
		color: 'rgb(140, 142, 151)',
		value: v,
		className: '!rounded-md',
		label: {
			text: `${compact ? '' : `${t('break_even_point')}: `}${sepNumbers(String(v))}`,
			align: 'center',
			textAlign: 'center',
			rotation: 0,
			verticalAlign: compact ? 'bottom' : 'top',
			useHTML: true,
			y: compact ? 0 : 40 + y,
			style: {
				fontFamily: chartFontSetting.fontFamily,
				fontSize: '12px',
				textAlign: 'center',
				fontWeight: '500',
				backgroundColor: compact ? 'rgb(255, 255, 255)' : 'rgb(140, 142, 151)',
				// @ts-expect-error: borderRadius has bug, it should be string, but it's number
				borderRadius: '4px',
				color: compact ? 'rgb(140, 142, 151)' : 'rgb(255, 255, 255)',
				padding: '4px 8px',
			},
		},
	});

	const getBaseAssetsPlotLine = (): XAxisPlotLinesOptions => ({
		dashStyle: compact ? 'Solid' : 'LongDash',
		width: 1.5,
		color: 'rgba(0, 87, 255, 1)',
		value: baseAssets ?? 0,
		className: '!rounded-md',
		label: {
			text: `${compact ? '' : `${t('base_assets')}: `}${sepNumbers(String(baseAssets ?? 0))}`,
			align: 'center',
			textAlign: 'center',
			rotation: 0,
			verticalAlign: 'top',
			useHTML: true,
			style: {
				fontFamily: chartFontSetting.fontFamily,
				fontSize: '12px',
				fontWeight: '500',
				backgroundColor: compact ? 'rgb(255, 255, 255)' : 'rgba(0, 87, 255, 1)',
				// @ts-expect-error: borderRadius has bug, it should be string, but it's number
				borderRadius: '4px',
				color: compact ? 'rgba(0, 87, 255, 1)' : 'rgb(255, 255, 255)',
				padding: '4px 8px',
			},
		},
	});

	const getYtm = (profitPercent: number, dueDays: number) => {
		try {
			if (profitPercent == null) throw new Error();

			dueDays = Math.max(dueDays, 1);

			profitPercent /= 100;

			const ytm = 100 * (Math.pow(1 + profitPercent, 365 / dueDays) - 1);

			return toFixed(ytm, 2);
		} catch (e) {
			return null;
		}
	};

	const onLoad = useCallback((el: HTMLDivElement | null) => {
		if (!el) return;

		chartRef.current = chart(el, {
			chart: {
				height,
			},
			tooltip: {
				enabled: false,
			},
			navigator: {
				enabled: !compact,
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
				crosshair: compact
					? false
					: {
							label: {
								formatter: (value) => sepNumbers(String(value)),
							},
						},
				labels: {
					enabled: !compact,
					formatter: ({ value }) => sepNumbers(String(value)),
				},
			},
			yAxis: {
				gridLineWidth: compact ? 0 : 1,
				type: 'linear',
				labels: {
					enabled: !compact,
					formatter: ({ value }) => sepNumbers(String(value)),
				},
				crosshair: compact ? false : {},
			},
			series: [getAreaSeries()],
		});
	}, []);

	useEffect(() => {
		if (!chartRef.current) return;

		try {
			const series = getAreaSeries();

			if (data.length <= 10) return;

			const bep: XAxisPlotLinesOptions[] = [];
			const diff = Math.floor((maxPrice - minPrice) / 100);
			const l = data.length;

			for (let i = 0; i < l; i++) {
				const item = data[i];
				const pnl = Math.round(item.y);

				if (pnl === 0 || i % diff === 0) {
					series.data!.push({
						x: item.x,
						y: pnl,
					});
				}

				if (pnl === 0) {
					bep.push(getBepPlotLine(item.x, bep.length * 30));
				} else if (i > 0) {
					const previousPNL = Math.round(data[i - 1].y);
					if ((previousPNL > 0 && pnl < 0) || (previousPNL < 0 && pnl > 0)) {
						bep.push(getBepPlotLine(item.x, bep.length * 30));
					}
				}
			}

			chartRef.current.update({
				xAxis: {
					plotLines: [getBaseAssetsPlotLine(), ...bep],
				},
				tooltip: {
					enabled: !compact,
					useHTML: true,
					formatter: function () {
						const x = Number(this.x ?? 0);
						const y = Number(this.y ?? 0);

						// ? ((pnl / price) - 1) * 100
						const profitPercent = ((y + baseAssets) / baseAssets - 1) * 100;
						const ytm =
							isNaN(profitPercent) || Math.abs(profitPercent) === Infinity
								? '−'
								: getYtm(profitPercent, 20);

						const li1 = `<li style="height:18px;font-size:12px;font-weight:500;display:flex;justify-content:space-between;align-items:center;gap:16px;"><span>${t('base_symbol_price')}:</span><span class="ltr">${sepNumbers(String(x))}</span></li>`;
						const li2 = `<li style="height:18px;font-size:12px;font-weight:500;display:flex;justify-content:space-between;align-items:center;gap:16px;"><span>${t('current_base_price_distance')}:</span><span class="ltr">${sepNumbers(String(Math.abs(baseAssets - x)))}</span></li>`;
						const li3 = `<li style="height:18px;font-size:12px;font-weight:500;display:flex;justify-content:space-between;align-items:center;gap:16px;"><span>${t('rial_efficiency')}:</span><span class="ltr">${sepNumbers(String(y))}</span></li>`;
						const li4 = `<li style="height:18px;font-size:12px;font-weight:500;display:flex;justify-content:space-between;align-items:center;gap:16px;"><span>${t('ytm')}:</span><span class="ltr">${ytm}</span></li>`;

						return `<ul style="display:flex;flex-direction:column;gap:8px;direction:rtl">${li1}${li2}${li3}${li4}</ul>`;
					},
				},
				series: [series],
			});
		} catch (e) {
			//
		}
	}, [chartRef.current, data, baseAssets]);

	useEffect(() => {
		if (!chartRef.current) return;
		chartRef.current.xAxis[0].setExtremes(minPrice, maxPrice);
	}, [minPrice, maxPrice]);

	return (
		<ErrorBoundary>
			<div className='gap-8 flex-column'>
				<div ref={onLoad} />

				{data.length <= 10 && (
					<div className='absolute size-full bg-white center'>
						<NoData text={t('no_active_contract_found')} />
					</div>
				)}

				{onChange && <PriceRange maxPrice={maxPrice} minPrice={minPrice} onChange={onChange} />}
			</div>
		</ErrorBoundary>
	);
};

export default AnalyzeChart;
