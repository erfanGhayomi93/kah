'use client';

import { ChartWaterfallSVG, MoneyTickSVG, PieChartSVG, RookSVG, SortSVG } from '@/components/icons';
import { sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import CompareAssets from './CompareAssets';
import PerformanceSummary from './PerformanceSummary';
import SmallCard from './SmallCard';

const AllAssets = () => {
	const t = useTranslations();

	return (
		<div className='darkBlue:bg-gray-50 flex-1 rounded bg-white px-12 py-16 flex-column dark:bg-gray-50'>
			<div className='flex flex-wrap *:px-4 *:pb-8'>
				<SmallCard
					style={{ flex: '1 1 22%' }}
					title={t('my_assets.card_total_assets')}
					icon={<PieChartSVG />}
					value={
						<span className='text-gray-700'>
							<span className='text-2xl font-medium text-gray-800'>{sepNumbers(String(74e8)) + ' '}</span>
							{t('common.rial')}
						</span>
					}
				/>
				<SmallCard
					title={t('my_assets.card_remains')}
					icon={<MoneyTickSVG />}
					value={
						<span className='text-gray-700'>
							<span className='text-lg font-medium text-gray-800'>{sepNumbers(String(185e7)) + ' '}</span>
							{t('common.rial')}
						</span>
					}
				/>
				<SmallCard
					title={t('my_assets.card_strategies')}
					icon={<RookSVG />}
					value={
						<span className='text-gray-700'>
							<span className='text-lg font-medium text-gray-800'>{sepNumbers(String(185e7)) + ' '}</span>
							{t('common.rial')}
						</span>
					}
				/>
				<SmallCard
					title={t('my_assets.card_positions')}
					icon={<SortSVG />}
					value={
						<span className='text-gray-700'>
							<span className='text-lg font-medium text-gray-800'>{sepNumbers(String(185e7)) + ' '}</span>
							{t('common.rial')}
						</span>
					}
				/>
				<SmallCard
					title={t('my_assets.card_stocks')}
					icon={<ChartWaterfallSVG />}
					value={
						<span className='text-gray-700'>
							<span className='text-lg font-medium text-gray-800'>{sepNumbers(String(185e7)) + ' '}</span>
							{t('common.rial')}
						</span>
					}
				/>
			</div>

			<div style={{ flex: '0 0 42.8rem' }} className='flex px-4 flex-column *:px-4 xl:flex-row'>
				<PerformanceSummary />
				<CompareAssets />
			</div>
		</div>
	);
};

export default AllAssets;
