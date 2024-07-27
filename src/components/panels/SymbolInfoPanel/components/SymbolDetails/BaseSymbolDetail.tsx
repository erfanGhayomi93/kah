import { ArrowDownSVG } from '@/components/icons';
import { useLocalstorage } from '@/hooks';
import { numFormatter as bigNumFormatter, sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';

interface ISymbolItem {
	id: string;
	title: string;
	value: string;
}

interface BaseSymbolDetailProps {
	symbolData: Symbol.Info;
	setHeight: (h: number) => void;
}

const BaseSymbolDetail = ({ symbolData, setHeight }: BaseSymbolDetailProps) => {
	const t = useTranslations();

	const [isExpand, setIsExpand] = useLocalstorage('sio', false);

	const numFormatter = (v: string | number | null) => {
		if (v === null) return '−';
		return sepNumbers(String(v ?? 0));
	};

	const items: ISymbolItem[] = useMemo(
		() => [
			{
				id: 'market_ype',
				title: t('symbol_info_panel.market_ype'),
				value: t(`exchange.${symbolData.exchange}`) ?? '−',
			},
			{
				id: 'trade_value',
				title: t('symbol_info_panel.trade_value'),
				value: bigNumFormatter(symbolData.tradeValue),
			},
			{
				id: 'trade_volume',
				title: t('symbol_info_panel.trade_volume'),
				value: bigNumFormatter(symbolData.tradeVolume),
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
		[symbolData],
	);

	const rows = useMemo(() => {
		if (!isExpand) return items;
		return items.slice(0, 6);
	}, [items, isExpand]);

	useEffect(() => {
		setHeight(isExpand ? 328 : 808);
	}, [isExpand]);

	return (
		<div className='px-8 pb-8 pt-16 flex-column'>
			<ul className='flex-column' style={{ height: `${rows.length * 40}px`, transition: 'height 200ms ease-in' }}>
				{rows.map((row) => (
					<li
						key={row.id}
						style={{ flex: '0 0 40px' }}
						className='odd:bg-gray-100 rounded-sm px-8 text-base flex-justify-between'
					>
						<span className='text-gray-700'>{row.title}:</span>
						<span className='text-gray-800 ltr'>{row.value}</span>
					</li>
				))}
			</ul>

			<button
				type='button'
				onClick={() => setIsExpand(!isExpand)}
				className='text-gray-700 size-24 w-full flex-justify-center'
			>
				<ArrowDownSVG
					width='1.4rem'
					height='1.4rem'
					className='transition-transform'
					style={{ transform: `rotate(${isExpand ? 0 : 180}deg)` }}
				/>
			</button>
		</div>
	);
};

export default BaseSymbolDetail;
