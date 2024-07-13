'use client';

import { useGlOptionOrdersQuery } from '@/api/queries/brokerPrivateQueries';
import { useTranslations } from 'next-intl';
import PriceCard from '../PriceCard';
import Table from './Table';

const Position = () => {
	const t = useTranslations('my_assets');

	useGlOptionOrdersQuery({
		queryKey: ['glOptionOrdersQuery'],
	});

	return (
		<div className='flex-1 gap-16 rounded bg-white p-16 flex-column'>
			<div className='flex gap-8'>
				<PriceCard className='w-1/3' title={t('portfolio_total_value')} value={263e3} />
				<PriceCard className='w-1/3' title={t('total_profit_and_loss')} percent={22} value={263e3} />
				<PriceCard className='w-1/3' title={t('today_profit_and_loss')} percent={22} value={263e3} />
			</div>

			<div className='flex-1 gap-40 flex-column'>
				<Table type='call' />
				<Table type='put' />
			</div>
		</div>
	);
};

export default Position;
