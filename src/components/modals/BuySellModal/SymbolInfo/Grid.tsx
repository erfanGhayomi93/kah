import Loading from '@/components/common/Loading';
import Tabs from '@/components/common/Tabs/Tabs';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

interface GridProps {
	symbolISIN: string;
}

const SymbolPriceTable = dynamic(() => import('@/components/common/Tables/SymbolPriceTable'), {
	ssr: false,
	loading: () => <Loading />,
});

const SymbolLinearChart = dynamic(() => import('@/components/common/Symbol/SymbolLinearChart'), {
	ssr: false,
	loading: () => <Loading />,
});

const Grid = ({ symbolISIN }: GridProps) => {
	const t = useTranslations();

	const tabs = useMemo(
		() => [
			{
				id: 'market_map',
				title: t('bs_modal.market_depth'),
				render: () => (
					<div className='relative flex-1 px-8 pb-8 pt-16'>
						<SymbolPriceTable symbolISIN={symbolISIN} compact={false} />
					</div>
				),
			},
			{
				id: 'chart',
				title: t('bs_modal.chart'),
				render: () => (
					<div className='relative flex-1 p-8'>
						<SymbolLinearChart symbolISIN={symbolISIN} height='256px' />
					</div>
				),
			},
		],
		[],
	);

	return (
		<div style={{ height: '30.8rem' }} className='relative rounded border border-gray-500 bg-white flex-column'>
			<Tabs
				data={tabs}
				defaultActiveTab='market_map'
				renderTab={(item, activeTab) => (
					<button
						className={clsx(
							'flex-1 p-8 transition-colors',
							item.id === activeTab ? 'font-medium text-gray-900' : 'text-gray-700',
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
