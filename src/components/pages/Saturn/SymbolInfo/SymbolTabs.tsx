import Loading from '@/components/common/Loading';
import Tabs, { type ITabIem } from '@/components/common/Tabs/Tabs';
import { cn } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const MarketDepth = dynamic(() => import('./Tabs/MarketDepth'), {
	ssr: false,
	loading: () => <Loading />,
});

interface SymbolTabsProps {
	symbol: Symbol.Info;
	activeTab: Saturn.SymbolTab;
	setActiveTab: (tabId: Saturn.SymbolTab) => void;
}
type TTab = ITabIem<Saturn.SymbolTab, { title: string }>;

const SymbolTabs = ({ symbol, activeTab, setActiveTab }: SymbolTabsProps) => {
	const t = useTranslations();

	const tabs = useMemo<TTab[]>(
		() => [
			{
				id: 'tab_market_depth',
				title: t('saturn_page.tab_market_depth'),
				render: () => <MarketDepth symbol={symbol} />,
			},
			{ id: 'tab_chart', title: t('saturn_page.tab_chart'), disabled: true, render: null },
			{ id: 'tab_my_asset', title: t('saturn_page.tab_my_asset'), disabled: true, render: null },
		],
		[symbol],
	);

	return (
		<div style={{ flex: '0 0 calc(50% - 1.8rem)' }} className='items-end gap-12 pl-16 flex-column'>
			<div className='relative w-full flex-1 gap-16 flex-column'>
				<Tabs<Saturn.SymbolTab, TTab>
					onChange={(tab) => setActiveTab(tab)}
					defaultActiveTab={activeTab}
					data={tabs}
					wrapper={({ children }) => <div className='relative flex-1'>{children}</div>}
					renderTab={(item, activeTab) => (
						<button
							className={cn(
								'p-8 transition-colors',
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
