import Tabs from '@/components/common/Tabs/Tabs';
import { cn } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import MarketDepth from './Tabs/MarketDepth';

interface ITab {
	id: Saturn.SymbolTab;
	title: string;
	render: React.ReactNode;
	disabled?: boolean;
}

interface SymbolTabsProps {
	symbol: Symbol.Info;
	activeTab: Saturn.SymbolTab;
	setActiveTab: (tabId: Saturn.SymbolTab) => void;
}

const SymbolTabs = ({ symbol, activeTab, setActiveTab }: SymbolTabsProps) => {
	const t = useTranslations();

	const tabs = useMemo<ITab[]>(
		() => [
			{
				id: 'tab_market_depth',
				title: t('saturn_page.tab_market_depth'),
				render: <MarketDepth symbol={symbol} />,
			},
			{ id: 'tab_chart', title: t('saturn_page.tab_chart'), disabled: true, render: null },
			{ id: 'tab_my_asset', title: t('saturn_page.tab_my_asset'), disabled: true, render: null },
		],
		[symbol],
	);

	return (
		<div style={{ flex: '0 0 calc(50% - 1.8rem)' }} className='items-end gap-12 pl-16 flex-column'>
			<div className='w-full gap-16 flex-column'>
				<Tabs<Saturn.SymbolTab, ITab>
					onChange={(tab) => setActiveTab(tab)}
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
