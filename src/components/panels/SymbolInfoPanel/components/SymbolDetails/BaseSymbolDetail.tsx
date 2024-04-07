import { ArrowDownSVG } from '@/components/icons';
import { sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useLayoutEffect, useMemo, useState } from 'react';

interface ISymbolItem {
	id: string;
	title: string;
	value: string;
}

interface BaseSymbolDetailProps {
	symbolData: Symbol.Info;
	onExpand: (isExpand: boolean) => void;
}

const BaseSymbolDetail = ({ symbolData, onExpand }: BaseSymbolDetailProps) => {
	const t = useTranslations();

	const [isExpand, setIsExpand] = useState(false);

	const numFormatter = (v: string | number | null) => {
		if (v === null) return '−';
		return sepNumbers(String(v ?? 0));
	};

	const items: [ISymbolItem[], ISymbolItem[]] = useMemo(
		() => [
			[
				{ id: 'market_ype', title: t('symbol_info_panel.market_ype'), value: symbolData.exchange ?? '−' },
				{
					id: 'trade_value',
					title: t('symbol_info_panel.trade_value'),
					value: numFormatter(symbolData.tradeValue),
				},
				{
					id: 'trade_volume',
					title: t('symbol_info_panel.trade_volume'),
					value: numFormatter(symbolData.tradeVolume),
				},
				{ id: 'nav', title: t('symbol_info_panel.nav'), value: numFormatter(symbolData.cancellationNAV) },
				{
					id: 'monthly_average_volume',
					title: t('symbol_info_panel.monthly_average_volume'),
					value: numFormatter(symbolData.oneMonthAvgVolume),
				},
				{ id: 'hv', title: t('symbol_info_panel.hv'), value: numFormatter((symbolData.hv ?? 0).toFixed(2)) },
				{
					id: 'wiv',
					title: t('symbol_info_panel.wiv'),
					value: numFormatter((symbolData.avgIV ?? 0).toFixed(2)),
				},
				{ id: 'stock_price_estimate', title: t('symbol_info_panel.stock_price_estimate'), value: '−' },
				{
					id: 'last_trade',
					title: t('symbol_info_panel.last_trade'),
					value: numFormatter(symbolData.lastTradedPrice),
				},
			],
			[
				{
					id: 'opening_rice',
					title: t('symbol_info_panel.opening_rice'),
					value: numFormatter(symbolData.openPrice),
				},
				{
					id: 'base_volume',
					title: t('symbol_info_panel.base_volume'),
					value: numFormatter(symbolData.baseVolume),
				},
				{
					id: 'trade_count',
					title: t('symbol_info_panel.trade_count'),
					value: numFormatter(symbolData.tradeCount),
				},
				{ id: 'eps', title: t('symbol_info_panel.eps'), value: numFormatter(symbolData.eps) },
				{ id: 'pe', title: t('symbol_info_panel.pe'), value: numFormatter(symbolData.pe) },
				{ id: 'ps', title: t('symbol_info_panel.ps'), value: numFormatter(symbolData.ps) },
				{
					id: '1_month_return',
					title: t('symbol_info_panel.month_efficiency', { m: 1 }),
					value: numFormatter(symbolData.oneMonthEfficiency),
				},
				{
					id: '3_month_return',
					title: t('symbol_info_panel.month_efficiency', { m: 3 }),
					value: numFormatter(symbolData.threeMonthEfficiency),
				},
				{
					id: 'year_efficiency',
					title: t('symbol_info_panel.year_efficiency'),
					value: numFormatter(symbolData.oneYearEfficiency),
				},
			],
		],
		[symbolData],
	);

	const data = useMemo(() => {
		if (!isExpand) return items[0];
		return [...items[0], ...items[1]];
	}, [items, isExpand]);

	useLayoutEffect(() => {
		onExpand(isExpand);
	}, [isExpand]);

	return (
		<div className='px-8 pb-8 pt-16 flex-column'>
			<ul className='flex-column' style={{ height: `${data.length * 40}px`, transition: 'height 200ms ease-in' }}>
				{data.map((item) => (
					<li
						style={{ flex: '0 0 40px' }}
						className='rounded-sm px-8 text-base flex-justify-between even:bg-gray-200'
						key={item.id}
					>
						<span className='text-gray-900'>{item.title}:</span>
						<span className='text-gray-1000 ltr'>{item.value}</span>
					</li>
				))}
			</ul>

			<button
				type='button'
				onClick={() => setIsExpand(!isExpand)}
				className='size-24 w-full text-gray-900 flex-justify-center'
			>
				<ArrowDownSVG
					width='1.4rem'
					height='1.4rem'
					className='transition-transform'
					style={{ transform: `rotate(${isExpand ? 180 : 0}deg)` }}
				/>
			</button>
		</div>
	);
};

export default BaseSymbolDetail;
