'use client';

import { useTranslations } from 'next-intl';
import PriceCard from '../PriceCard';
import Table from './Table';

const Stocks = () => {
	const t = useTranslations('my_assets');

	return (
		<div className='flex-1 gap-16 rounded bg-white p-16 flex-column'>
			<div className='flex gap-8'>
				<PriceCard className='w-1/4' title={t('portfolio_total_value')} value={263e3} />
				<PriceCard className='w-1/4' title={t('total_profit_and_loss')} percent={22} value={263e3} />
				<PriceCard className='w-1/4' title={t('today_profit_and_loss')} percent={22} value={263e3} />
				<PriceCard className='w-1/4' title={t('assembly_profit')} percent={22} value={263e3} />
			</div>

			<Table />
		</div>
	);
};

export default Stocks;
