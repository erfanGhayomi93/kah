import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setPriceChangeWatchlistModal } from '@/features/slices/modalSlice';
import { type RootState } from '@/features/store';
import { createSelector } from '@reduxjs/toolkit';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Section from '../../common/Section';

const PriceChangesWatchlistChart = dynamic(() => import('./PriceChangesWatchlistChart'));

interface IPriceChangeWatchlistProps {
	isModal: boolean;
}

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		getPriceChangeWatchlist: state.modal.priceChangeWatchlist,
	}),
);

const PriceChangesWatchlist = ({ isModal = false }: IPriceChangeWatchlistProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { getPriceChangeWatchlist } = useAppSelector(getStates);

	return (
		<Section
			id='price_changes_watchlist'
			title={t('home.price_changes_watchlist')}
			info={t('tooltip.price_change_watchlist_section')}
			closeable={!isModal}
			expandable={!isModal}
			onExpand={() => dispatch(setPriceChangeWatchlistModal(getPriceChangeWatchlist ? null : {}))}
		>
			<PriceChangesWatchlistChart />
		</Section>
	);
};

export default PriceChangesWatchlist;
