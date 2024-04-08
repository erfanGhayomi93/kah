import SymbolLinearChart from '@/components/common/Symbol/SymbolLinearChart';
import SymbolPriceTable from '@/components/common/Tables/SymbolPriceTable';
import Tabs from '@/components/common/Tabs/Tabs';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface GridProps {
	symbolISIN: string;
}

const Grid = ({ symbolISIN }: GridProps) => {
	const t = useTranslations();

	const tabs = useMemo(
		() => [
			{
				id: 'market_map',
				title: t('bs_modal.market_depth'),
				render: () => (
					<div className='flex-1 p-8'>
						<SymbolPriceTable symbolISIN={symbolISIN} />
					</div>
				),
			},
			{
				id: 'chart',
				title: t('bs_modal.chart'),
				render: () => (
					<div className='flex-1 p-8'>
						<SymbolLinearChart symbolISIN={symbolISIN} />
					</div>
				),
			},
		],
		[],
	);

	return (
		<div style={{ height: '26rem' }} className='relative rounded border border-gray-500 bg-white flex-column'>
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
