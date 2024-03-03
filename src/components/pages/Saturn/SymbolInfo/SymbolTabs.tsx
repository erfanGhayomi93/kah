import SymbolPriceTable from '@/components/common/Tables/SymbolPriceTable';
import Tabs from '@/components/common/Tabs/Tabs';
import { MoreOptionsSVG } from '@/components/icons';
import { useTradingFeatures } from '@/hooks';
import { cn } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface SymbolTabsProps {
	symbol: Symbol.Info;
	activeTab: Saturn.SymbolTab;
	setActiveTab: (tabId: Saturn.SymbolTab) => void;
}

const SymbolTabs = ({ symbol, activeTab, setActiveTab }: SymbolTabsProps) => {
	const t = useTranslations();

	const { addBuySellModal } = useTradingFeatures();

	const addBsModal = (side: TBsSides) => {
		if (!symbol) return;

		const { symbolISIN, symbolTitle } = symbol;

		addBuySellModal({
			side,
			symbolType: 'base',
			symbolISIN,
			symbolTitle,
		});
	};

	const tabs = useMemo(
		() => [
			{
				id: 'tab_market_depth',
				title: t('saturn_page.tab_market_depth'),
				render: <SymbolPriceTable symbolISIN={symbol.symbolISIN} />,
			},
			{ id: 'tab_chart', title: t('saturn_page.tab_chart'), disabled: true, render: null },
			{ id: 'tab_my_asset', title: t('saturn_page.tab_my_asset'), disabled: true, render: null },
		],
		[symbol],
	);

	return (
		<div style={{ flex: '0 0 calc(50% - 1.8rem)' }} className='items-end gap-12 pl-16 flex-column'>
			<div className='gap-8 flex-items-center'>
				<button
					onClick={() => addBsModal('buy')}
					type='button'
					className='h-32 w-96 rounded btn-success-outline'
				>
					{t('side.buy')}
				</button>
				<button
					onClick={() => addBsModal('sell')}
					type='button'
					className='h-32 w-96 rounded btn-error-outline'
				>
					{t('side.sell')}
				</button>

				<button type='button' className='size-24 text-gray-1000'>
					<MoreOptionsSVG width='2.4rem' height='2.4rem' />
				</button>
			</div>

			<div className='w-full gap-16 flex-column'>
				<Tabs
					defaultActiveTab={activeTab}
					data={tabs}
					renderTab={(item, activeTab) => (
						<button
							className={cn(
								'px-8 py-12 transition-colors',
								item.id === activeTab ? 'font-medium text-gray-900' : 'text-gray-700',
							)}
							type='button'
						>
							{item.title}
						</button>
					)}
				/>
			</div>
		</div>
	);
};

export default SymbolTabs;
