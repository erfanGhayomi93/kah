import { chartFontSetting } from '@/libs/highchart';
import { sepNumbers } from '@/utils/helpers';
import { type Chart, chart, type XAxisPlotLinesOptions } from 'highcharts/highstock';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import NoData from '../NoData';
import PriceRange from './PriceRange';

interface AnalyzeChartProps
	extends Pick<
		IAnalyzeInputs,
		'minPrice' | 'baseAssets' | 'maxPrice' | 'dueDays' | 'income' | 'cost' | 'contractSize' | 'data' | 'bep'
	> {
	height?: number;
	compact?: boolean;
	onChange?: (values: Pick<IAnalyzeInputs, 'minPrice' | 'maxPrice'>) => void;
}

const AnalyzeChart = ({
	data,
	baseAssets,
	contractSize,
	cost,
	income,
	dueDays,
	maxPrice,
	minPrice,
	bep,
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

	const getYtm = (profit: number) => {
		try {
			if (profit == null) throw new Error();

			const ytm = (Math.pow(1 + profit, 365 / Math.max(dueDays, 1)) - 1) * 100;

			return Number(ytm.toFixed(2));
		} catch (e) {
			return 0;
		}
	};

	const onLoad = useCallback((el: HTMLDivElement | null) => {
		if (!el) return;

		chartRef.current = chart(el, {
			chart: {
				height,
				marginBottom: 16,
				spacingBottom: 20,
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
					type: 'linear',
					showFirstLabel: true,
					showLastLabel: true,
					gridLineWidth: 0,
					labels: {
						enabled: true,
						padding: '0',
						align: 'center',
						rotation: 0,
						y: 16,
						formatter: ({ value }) => sepNumbers(String(value)),
						style: {
							...chartFontSetting,
							opacity: 1,
							color: 'rgba(93, 96, 109, 1)',
						},
					},
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
					enabled: false,
				},
			},
			yAxis: {
				type: 'linear',
				gridLineWidth: compact ? 0 : 1,
				minPadding: compact ? 0 : 0.025,
				maxPadding: compact ? 0 : 0.025,
				labels: {
					enabled: !compact,
					formatter: ({ value }) => sepNumbers(String(value)),
				},
				crosshair: compact ? false : {},
			},
			series: [
				{
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
				},
			],
		});
	}, []);

	useEffect(() => {
		if (!chartRef.current) return;

		chartRef.current.zoomOut();
	}, [minPrice, maxPrice]);

	useEffect(() => {
		if (!chartRef.current) return;

		chartRef.current.series[0].setData(data);
		chartRef.current.xAxis[0].update({
			plotLines: [getBaseAssetsPlotLine(), ...bep.map((v, i) => getBepPlotLine(v, i * 30))],
		});
	}, [data]);

	useEffect(() => {
		if (!chartRef.current) return;

		chartRef.current.tooltip.update({
			enabled: !compact,
			useHTML: true,
			split: true,
			formatter: function () {
				const x = Number(this.x ?? 0);
				const y = Number(this.y ?? 0);

				const profit = y > 0 ? Math.abs((y * contractSize) / cost) : Math.abs((y * contractSize) / income) * -1;
				const efficiency = Math.max(profit * 100, -100);

				let ytm = isNaN(profit) || Math.abs(profit) === Infinity ? 0 : getYtm(profit);
				ytm = Math.floor(Math.max(Math.min(ytm, 1e9), -1e2));

				const items = [
					`<li style="height:18px;font-size:12px;font-weight:500;display:flex;justify-content:space-between;align-items:center;gap:16px;"><span>${t('base_symbol_price')}:</span><span class="ltr">${sepNumbers(String(x))}</span></li>`,
					`<li style="height:18px;font-size:12px;font-weight:500;display:flex;justify-content:space-between;align-items:center;gap:16px;"><span>${t('current_base_price_distance')}:</span><span class="ltr">${sepNumbers(String(Math.abs(baseAssets - x)))}</span></li>`,
					`<li style="height:18px;font-size:12px;font-weight:500;display:flex;justify-content:space-between;align-items:center;gap:16px;"><span>${t('rial_efficiency')}:</span><span class="ltr">${sepNumbers(String(y * contractSize))}</span></li>`,
					`<li style="height:18px;font-size:12px;font-weight:500;display:flex;justify-content:space-between;align-items:center;gap:16px;"><span>${t('percent_efficiency')}:</span><span class="ltr">${efficiency >= Number.MAX_SAFE_INTEGER ? t('infinity') : `${efficiency.toFixed(2)}%`}</span></li>`,
					`<li style="height:18px;font-size:12px;font-weight:500;display:flex;justify-content:space-between;align-items:center;gap:16px;"><span>${t('cost')}:</span><span class="ltr">${sepNumbers(String(cost))}</span></li>`,
					`<li style="height:18px;font-size:12px;font-weight:500;display:flex;justify-content:space-between;align-items:center;gap:16px;"><span>${t('ytm')}:</span><span class="ltr">${ytm === 1e9 ? '+1,000,000,000' : sepNumbers(String(ytm))}%</span></li>`,
				];

				return `<ul style="display:flex;flex-direction:column;gap:8px;direction:rtl">${items.join('')}</ul>`;
			},
		});
	}, [baseAssets, contractSize, income, dueDays, cost]);

	return (
		<ErrorBoundary>
			<div className='gap-16 flex-column'>
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
