import { ArrowDownSVG } from '@/components/icons';
import { useTranslations } from 'next-intl';
import { useLayoutEffect, useMemo, useState } from 'react';

interface ISymbolItem {
	id: string;
	title: string;
	value: string;
}

interface BaseSymbolDetailProps {
	onToggleSymbolDetail: (isExpand: boolean) => void;
}

const BaseSymbolDetail = ({ onToggleSymbolDetail }: BaseSymbolDetailProps) => {
	const t = useTranslations();

	const [isExpand, setIsExpand] = useState(false);

	const items: [ISymbolItem[], ISymbolItem[]] = useMemo(
		() => [
			[
				{ id: 'market_ype', title: t('symbol_info_panel.market_ype'), value: '−' },
				{ id: 'trade_value', title: t('symbol_info_panel.trade_value'), value: '−' },
				{ id: 'trade_volume', title: t('symbol_info_panel.trade_volume'), value: '−' },
				{ id: 'nav', title: t('symbol_info_panel.nav'), value: '−' },
				{ id: 'monthly_average_volume', title: t('symbol_info_panel.monthly_average_volume'), value: '−' },
				{ id: 'hv', title: t('symbol_info_panel.hv'), value: '−' },
				{ id: 'wiv', title: t('symbol_info_panel.wiv'), value: '−' },
				{ id: 'stock_price_estimate', title: t('symbol_info_panel.stock_price_estimate'), value: '−' },
				{ id: 'last_trade', title: t('symbol_info_panel.last_trade'), value: '−' },
			],
			[
				{ id: 'opening_rice', title: t('symbol_info_panel.opening_rice'), value: '−' },
				{ id: 'base_volume', title: t('symbol_info_panel.base_volume'), value: '−' },
				{ id: 'trade_count', title: t('symbol_info_panel.trade_count'), value: '−' },
				{ id: 'eps', title: t('symbol_info_panel.eps'), value: '−' },
				{ id: 'pe', title: t('symbol_info_panel.pe'), value: '−' },
				{ id: 'ps', title: t('symbol_info_panel.ps'), value: '−' },
				{ id: '1_month_return', title: t('symbol_info_panel.month_return', { m: 1 }), value: '−' },
				{ id: '3_month_return', title: t('symbol_info_panel.month_return', { m: 3 }), value: '−' },
				{ id: 'year_return', title: t('symbol_info_panel.year_return'), value: '−' },
			],
		],
		[],
	);

	const data = useMemo(() => {
		if (!isExpand) return items[0];
		return [...items[0], ...items[1]];
	}, [isExpand]);

	useLayoutEffect(() => {
		onToggleSymbolDetail(isExpand);
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
						<span className='text-gray-1000'>{item.value}</span>
					</li>
				))}
			</ul>

			<button
				type='button'
				onClick={() => setIsExpand(!isExpand)}
				className='size-24 w-full text-gray-900 flex-justify-center'
			>
				<ArrowDownSVG
					width='1.6rem'
					height='1.6rem'
					className='transition-transform'
					style={{ transform: `rotate(${isExpand ? 180 : 0}deg)` }}
				/>
			</button>
		</div>
	);
};

export default BaseSymbolDetail;
