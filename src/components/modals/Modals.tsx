'use client';

import { useAppSelector } from '@/features/hooks';
import LoginModal from './LoginModal';
import OptionWatchlistFiltersModal from './OptionWatchlistFiltersModal';

const Modals = () => {
	const { loginModal, optionFilters } = useAppSelector((state) => state.modal);

	return [
		loginModal && <LoginModal key='login-modal' />,
		optionFilters && <OptionWatchlistFiltersModal key='option-watchlist-filters-modal' />,
	];
};

export default Modals;
