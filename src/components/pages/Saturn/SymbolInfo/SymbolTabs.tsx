import Loading from '@/components/common/Loading';
import Tabs, { type ITabIem } from '@/components/common/Tabs/Tabs';
import { cn } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import IndividualAndLegal from './IndividualAndLegal';

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
	const t = useTranslations();

	const tabs = useMemo<TTab[]>(
		() => [
			{
				id: 'tab_market_depth',
				title: t('saturn_page.tab_market_depth'),
				render: () => (
					<div style={{ height: '23.2rem' }} className='relative flex-1 gap-40 flex-column'>
						<SymbolMarketDepth
							rowSpacing={8}
							rowHeight={32}
							symbolISIN={symbol.symbolISIN}
							lowThreshold={symbol.lowThreshold}
							highThreshold={symbol.highThreshold}
						/>
					</div>
				),
			},
			{
				id: 'tab_chart',
				title: t('saturn_page.tab_chart'),
				render: () => (
					<div style={{ height: '23rem' }} className='relative size-full'>
						<SymbolChartData symbolISIN={symbol.symbolISIN} />
					</div>
				),
			},
			{ id: 'tab_my_asset', title: t('saturn_page.tab_my_asset'), disabled: true, render: null },
		],
		[symbol],
	);

	return (
		<div style={{ flex: '0 0 calc(50% - 1.8rem)' }} className='items-end gap-32 pl-16 flex-column'>
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
								item.id === activeTab ? 'text-light-gray-700 font-medium' : 'text-light-gray-500',
							)}
							type='button'
						>
							{item.title}
						</button>
					)}
				/>
			</div>

			<IndividualAndLegal symbol={symbol} />
		</div>
	);
};

export default SymbolTabs;
