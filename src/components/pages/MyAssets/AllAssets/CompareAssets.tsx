import { sepNumbers } from '@/utils/helpers';
import num2persian from '@/utils/num2persian';
import { type Chart, chart, type SeriesPieOptions } from 'highcharts/highstock';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import data from './data2.json';
import LargeCard from './LargeCard';

interface LegendProps {
	percent: number;
	title: string;
	color: string;
}

const CompareAssets = () => {
	const t = useTranslations();

	const chartRef = useRef<Chart | null>(null);

	const colors = ['rgba(255, 177, 26, 1)', 'rgba(65, 161, 249, 1)', 'rgba(0, 194, 136, 1)', 'rgba(143, 44, 243, 1)'];

	const total = data.reduce((total, v) => total + v, 0);

	const getSubtitle = (): string => {
		return `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:8px" class="text-gray-700 text-base"><span>${t('my_assets.card_total_assets')}:</span><span class="text-gray-800 text-lg font-medium">${sepNumbers(String(total))}</span><span>${t('common.rial')}</span></div>`;
	};

	const series: SeriesPieOptions = useMemo(() => {
		const result: SeriesPieOptions = {
			type: 'pie',
			data: [],
		};

		result.data = data.map((item, i) => ({
			name: String(i),
			y: item,
		}));

		return result;
	}, [data]);

	const onLoad = useCallback((el: HTMLDivElement | null) => {
		if (!el) return;

		chartRef.current = chart(el, {
			chart: {
				height: 260,
				zooming: {
					mouseWheel: false,
					singleTouch: false,
				},
			},
			tooltip: {
				formatter: function () {
					return `<span class="text-white">\u200f${num2persian(String(this.y ?? 0))}</span>`;
				},
			},
			subtitle: {
				useHTML: true,
				verticalAlign: 'middle',
				text: getSubtitle(),
			},
			plotOptions: {
				pie: {
					size: '100%',
					innerSize: '60%',
					borderRadius: 2,
					slicedOffset: 16,
					borderWidth: 2,
					center: ['50%', '50%'],
					states: {
						hover: {
							shadow: false,
							halo: null,
						},
					},
				},
				series: {
					borderWidth: 0,
				},
			},
			colors,
			series: [series],
		});
	}, []);

	useEffect(() => {
		if (!chartRef.current) return;

		chartRef.current.series[0].update(series);
		chartRef.current.setSubtitle({
			text: getSubtitle(),
		});
	}, [series]);

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
		<LargeCard style={{ flex: '1 1 39%' }} title={t('my_assets.compare_assets')}>
			<div className='flex-1'>
				<div ref={onLoad} />
			</div>

			<div className='justify-between pl-8 flex-column'>
				<div className='flex flex-wrap gap-x-40 gap-y-8'>
					<Legend
						percent={(data[0] / total) * 100}
						title={t('my_assets.legend_positions')}
						color='rgba(255, 177, 26, 1)'
					/>
					<Legend
						percent={(data[1] / total) * 100}
						title={t('my_assets.legend_stock')}
						color='rgba(65, 161, 249, 1)'
					/>
					<Legend
						percent={(data[2] / total) * 100}
						title={t('my_assets.legend_remains')}
						color='rgba(0, 194, 136, 1)'
					/>
					<Legend
						percent={(data[3] / total) * 100}
						title={t('my_assets.legend_strategies')}
						color='rgba(143, 44, 243, 1)'
					/>
				</div>
			</div>
		</LargeCard>
	);
};

const Legend = ({ title, percent, color }: LegendProps) => (
	<div style={{ flex: '1 1 40%' }} className='flex-justify-between'>
		<div className='gap-8 flex-items-center'>
			<span style={{ backgroundColor: color }} className='size-8 rounded-circle' />
			<span className='text-gray-700 text-lg'>{title}:</span>
		</div>
		<span className='text-gray-800 text-base'>({percent.toFixed(2)}%)</span>
	</div>
);

export default CompareAssets;
