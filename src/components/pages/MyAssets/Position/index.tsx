'use client';

import { useGlOptionOrdersQuery } from '@/api/queries/brokerPrivateQueries';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { useTranslations } from 'next-intl';
import PriceCard from '../PriceCard';
import CallTable from './CallTable';
import PutTable from './PutTable';

const Position = () => {
	const t = useTranslations('my_assets');

	const brokerUrls = useAppSelector(getBrokerURLs);

	const { data, isLoading } = useGlOptionOrdersQuery({
		queryKey: ['glOptionOrdersQuery'],
		enabled: Boolean(brokerUrls),
	});

	return (
		<div className='darkBlue:bg-gray-50 flex-1 gap-16 rounded bg-white p-16 flex-column dark:bg-gray-50'>
			<div className='flex gap-8'>
				<PriceCard className='w-1/3' title={t('portfolio_total_value')} value={263e3} />
				<PriceCard className='w-1/3' title={t('total_profit_and_loss')} percent={22} value={263e3} />
				<PriceCard className='w-1/3' title={t('today_profit_and_loss')} percent={22} value={263e3} />
			</div>

			<div className='flex-1 gap-40 flex-column'>
				<CallTable isLoading={isLoading} data={data?.buyPositions ?? []} />
				<PutTable isLoading={isLoading} data={data?.sellPositions ?? []} />
			</div>
		</div>
	);
};

export default Position;
