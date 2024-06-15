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
}

const SymbolMarketDepth = dynamic(() => import('@/components/common/Tables/SymbolMarketDepth'), {
	ssr: false,
	loading: () => <Loading />,
});

const Chart = dynamic(() => import('./Chart'), {
	ssr: false,
	loading: () => <Loading />,
});

const Grid = ({ symbolISIN, lowThreshold, highThreshold }: GridProps) => {
	const t = useTranslations();

	const tabs = useMemo(
		() => [
			{
				id: 'market_map',
				title: t('bs_modal.market_depth'),
				render: () => (
					<div className='relative flex-1 px-8 pb-8 pt-16'>
						<SymbolMarketDepth
							symbolISIN={symbolISIN}
							lowThreshold={lowThreshold}
							highThreshold={highThreshold}
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
			style={{ height: '30.8rem' }}
			className='border-light-gray-200 relative rounded border bg-white flex-column'
		>
			<Tabs
				data={tabs}
				defaultActiveTab='market_map'
				renderTab={(item, activeTab) => (
					<button
						className={clsx(
							'flex-1 p-8 transition-colors',
							item.id === activeTab ? 'text-light-gray-700 font-medium' : 'text-light-gray-500',
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
