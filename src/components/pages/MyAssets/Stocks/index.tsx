'use client';

import { useGlPortfolioQuery } from '@/api/queries/brokerPrivateQueries';
import { useCommissionsQuery } from '@/api/queries/commonQueries';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import PriceCard from '../PriceCard';
import Table from './Table';

const Stocks = () => {
	const t = useTranslations('my_assets');

	const searchParams = useSearchParams();

	const brokerUrls = useAppSelector(getBrokerURLs);

	const { data, isLoading } = useGlPortfolioQuery({
		queryKey: ['glPortfolioQuery', (searchParams.get('pb') ?? 'LastTradePrice') as TPriceBasis],
		enabled: Boolean(brokerUrls),
	});

	const { data: commissions } = useCommissionsQuery({
		queryKey: ['commissionQuery'],
	});

	const response = useMemo(() => {
		const result = {
			totalValue: 0,
			pnl: 0,
			pnlPercent: 0,
			todayPnl: 0,
			todayPnlPercent: 0,
			dps: 0,
			dpsPercent: 0,
		};

		if (!Array.isArray(data)) return result;

		const l = data.length;

		for (let i = 0; i < l; i++) {
			const item = data[i];
			const sellCommission = commissions?.[item.marketUnit]?.sellCommission ?? 0;

			const amount = item.price * item.asset;
			const tradeCommission = amount - Math.ceil(Math.abs(sellCommission * amount));

			result.totalValue += tradeCommission ?? 0;
			result.pnl += item.totalPNL ?? 0;
			result.pnlPercent += item.totalPNLPercent ?? 0;
			result.todayPnl += item.todayPNL ?? 0;
			result.todayPnlPercent += item.todayPNLPercent ?? 0;
			result.dps += item.dps ?? 0;
			result.dpsPercent += item.dpsPercent ?? 0;
		}

		result.pnlPercent = Number(result.pnlPercent.toFixed(2));
		result.todayPnlPercent = Number(result.todayPnlPercent.toFixed(2));
		result.dpsPercent = Number(result.dpsPercent.toFixed(2));

		return result;
	}, [data, commissions]);

	return (
		<div className='flex-1 gap-16 rounded bg-white p-16 flex-column dark:bg-gray-50'>
			<div className='flex gap-8'>
				<PriceCard
					loading={isLoading}
					className='w-1/4'
					title={t('portfolio_total_value')}
					value={response.totalValue}
				/>
				<PriceCard
					loading={isLoading}
					className='w-1/4'
					title={t('total_profit_and_loss')}
					percent={response.pnlPercent}
					value={response.pnl}
				/>
				<PriceCard
					loading={isLoading}
					className='w-1/4'
					title={t('today_profit_and_loss')}
					percent={response.todayPnlPercent}
					value={response.todayPnl}
				/>
				<PriceCard
					loading={isLoading}
					className='w-1/4'
					title={t('assembly_profit')}
					percent={response.dpsPercent}
					value={response.dps}
				/>
			</div>

			<Table loading={isLoading} data={data ?? []} />
		</div>
	);
};

export default Stocks;
