import Loading from '@/components/common/Loading';
import Tabs, { type ITabIem } from '@/components/common/Tabs/Tabs';
import { cn } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const SymbolMarketDepth = dynamic(() => import('@/components/common/Tables/SymbolMarketDepth'), {
	ssr: false,
	loading: () => <Loading />,
});

const SymbolChartData = dynamic(() => import('./SymbolChartData'), {
	ssr: false,
	loading: () => <Loading />,
});

type TTab = ITabIem<Saturn.SymbolTab, { title: string }>;

interface SymbolTabsProps {
	symbol: Symbol.Info;
	activeTab: Saturn.SymbolTab;
	setActiveTab: (tabId: Saturn.SymbolTab) => void;
}

const SymbolTabs = ({ symbol, activeTab, setActiveTab }: SymbolTabsProps) => {
	const t = useTranslations('saturn_page');

	const tabs = useMemo<TTab[]>(
		() => [
			{
				id: 'tab_market_depth',
				title: t('tab_market_depth'),
				render: () => (
					<div style={{ height: '23.2rem' }} className='relative flex-1 gap-40 flex-column'>
						<SymbolMarketDepth
							rowSpacing={8}
							rowHeight={32}
							symbolISIN={symbol.symbolISIN}
							lowThreshold={symbol.lowThreshold}
							highThreshold={symbol.highThreshold}
							yesterdayClosingPrice={symbol.yesterdayClosingPrice}
						/>
					</div>
				),
			},
			{
				id: 'tab_chart',
				title: t('tab_chart'),
				render: () => (
					<div style={{ height: '23rem' }} className='relative size-full'>
						<SymbolChartData symbolISIN={symbol.symbolISIN} tab='symbol_chart' />
					</div>
				),
			},
		],
		[symbol],
	);

	return (
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
							item.id === activeTab ? 'font-medium text-gray-700' : 'text-gray-500',
						)}
						type='button'
					>
						{item.title}
					</button>
				)}
			/>
		</div>
	);
};

export default SymbolTabs;
