'use client';

import { getColorBasedOnPercent, sepNumbers } from '@/utils/helpers';

import { useTranslations } from 'next-intl';

import Table from './Table';

interface PriceCardProps {
	percent?: number;
	value: number;
	title: string;
}

const Stocks = () => {
	const t = useTranslations('my_assets');

	return (
		<div className='flex-1 gap-16 rounded bg-white p-16 flex-column'>
			<div className='flex gap-8'>
				<PriceCard title={t('portfolio_total_value')} value={263e3} />
				<PriceCard title={t('total_profit_and_loss')} percent={22} value={263e3} />
				<PriceCard title={t('today_profit_and_los')} percent={22} value={263e3} />
				<PriceCard title={t('assembly_profit')} percent={22} value={263e3} />
			</div>

			<Table />
		</div>
	);
};

const PriceCard = ({ value, title, percent }: PriceCardProps) => {
	const t = useTranslations('common');

	return (
		<div className='h-64 w-1/4 rounded px-8 shadow-card flex-justify-between'>
			<span className='text-base text-light-gray-700'>{title}:</span>
			<div className='flex gap-8 text-base'>
				{percent !== undefined && (
					<span className={getColorBasedOnPercent(percent)}>({percent.toFixed(2)}%)</span>
				)}
				<span className='text-light-gray-700'>
					<span className='font-medium text-light-gray-800'>{sepNumbers(String(value))} </span>
					{t('rial')}
				</span>
			</div>
		</div>
	);
};

export default Stocks;
