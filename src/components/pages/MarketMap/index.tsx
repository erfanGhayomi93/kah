'use client';

import Loading from '@/components/common/Loading';
import { useAppSelector } from '@/features/hooks';
import { getBrokerIsSelected, getIsLoggedIn } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { useRouter } from '@/navigation';
import { createSelector } from '@reduxjs/toolkit';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import Map from './Map';
import MarketMapFilters from './MarketMapFilters';

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		isLoggedIn: getIsLoggedIn(state),
		brokerIsSelected: getBrokerIsSelected(state),
	}),
);

const MarketMap = () => {
	const t = useTranslations();

	const router = useRouter();

	const { brokerIsSelected, isLoggedIn } = useAppSelector(getStates);

	const [filters, setFilters] = useState<TMarketMapFilters>({
		map: { id: 'all', label: t('market_map.map_type_all') },
		display: { id: 'symbol', label: t('market_map.display_symbol') },
		market: { id: 'all', label: t('market_map.market_type_all') },
		property: { id: 'volume', label: t('market_map.volume') },
		symbolType: { id: 'all', label: t('market_map.symbol_type_all') },
		sector: null,
		percentage: null,
		watchlist: null,
		palette: null,
	});

	const onReset = () => {
		setFilters({
			map: { id: 'all', label: t('market_map.map_type_all') },
			display: { id: 'symbol', label: t('market_map.display_symbol') },
			market: { id: 'all', label: t('market_map.market_type_all') },
			property: { id: 'volume', label: t('market_map.volume') },
			symbolType: { id: 'all', label: t('market_map.symbol_type_all') },
			sector: null,
			percentage: null,
			watchlist: null,
			palette: null,
		});
	};

	useEffect(() => {
		if (!isLoggedIn || !brokerIsSelected) {
			router.push('/');
		}
	}, []);

	if (!isLoggedIn || !brokerIsSelected) return <Loading />;

	return (
		<div className='flex h-full flex-col'>
			<MarketMapFilters filters={filters} setFilters={setFilters} onReset={onReset} />

			<div className='flex  flex-1 overflow-hidden p-8 pt-0'>
				<Map filters={filters} setFilters={setFilters} />
			</div>
		</div>
	);
};

export default MarketMap;
