import Loading from '@/components/common/Loading';
import Tabs from '@/components/common/Tabs/Tabs';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

interface GridProps {
	symbolISIN: string;
	lowThreshold: number;
	highThreshold: number;
	yesterdayClosingPrice: number;
	setInputValue: TSetBsModalInputs;
}

const SymbolMarketDepth = dynamic(() => import('@/components/common/Tables/SymbolMarketDepth'), {
	ssr: false,
	loading: () => <Loading />,
});

const Chart = dynamic(() => import('./Chart'), {
	ssr: false,
	loading: () => <Loading />,
});

const Grid = ({ symbolISIN, lowThreshold, highThreshold, yesterdayClosingPrice, setInputValue }: GridProps) => {
	const t = useTranslations();

	const tabs = useMemo(
		() => [
			{
				id: 'market_map',
				title: t('bs_modal.market_depth'),
				render: () => (
					<div className='relative flex-1 px-8 pb-8 pt-16'>
						<SymbolMarketDepth
							rowSpacing={8}
							symbolISIN={symbolISIN}
							lowThreshold={lowThreshold}
							highThreshold={highThreshold}
							yesterdayClosingPrice={yesterdayClosingPrice}
							onPriceClick={(v, s) => {
								setInputValue('price', v);
								setInputValue('side', s === 'buy' ? 'sell' : 'buy');
							}}
							onQuantityClick={(v) => setInputValue('quantity', v)}
						/>
					</div>
				),
			},
			{
				id: 'chart',
				title: t('bs_modal.chart'),
				render: () => <Chart symbolISIN={symbolISIN} />,
			},
		],
		[],
	);

	return (
		<div
			style={{ height: '28.8rem' }}
			className='darkBlue:bg-gray-50 relative rounded bg-white shadow-card flex-column dark:bg-gray-50'
		>
			<Tabs
				data={tabs}
				defaultActiveTab='market_map'
				renderTab={(item, activeTab) => (
					<button
						className={clsx(
							'flex-1 p-8 transition-colors',
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

export default Grid;
