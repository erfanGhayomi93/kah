'use client';

import { useAppSelector } from '@/features/hooks';
import AddNewOptionWatchlist from './AddNewOptionWatchlist';
import AddSaturnTemplate from './AddSaturnTemplate';
import AddSymbolToWatchlist from './AddSymbolToWatchlist';
import BuySellModal from './BuySellModal';
import ForgetPasswordModal from './ForgetPasswordModal';
import LoginModal from './LoginModal';
import LogoutModal from './Logout';
import ManageOptionWatchlistList from './ManageOptionWatchlistList';
import OptionWatchlistFiltersModal from './OptionWatchlistFiltersModal';
import SymbolContracts from './SymbolContracts';

const Modals = () => {
	const {
		loginModal,
		logout,
		optionFilters,
		forgetPassword,
		symbolContracts,
		addSaturnTemplate,
		addNewOptionWatchlist,
		manageOptionWatchlistList,
		buySell,
		addSymbolToWatchlist,
	} = useAppSelector((state) => state.modal);

	return [
		loginModal && <LoginModal key='login-modal' />,
		logout && <LogoutModal key='logout-modal' />,
		optionFilters && <OptionWatchlistFiltersModal key='option-watchlist-filters-modal' />,
		forgetPassword && (
			<ForgetPasswordModal
				key='forget-password-modal'
				phoneNumber={
					forgetPassword && typeof forgetPassword === 'object' ? forgetPassword?.phoneNumber : undefined
				}
			/>
		),
		symbolContracts && <SymbolContracts key='symbol-contracts' {...symbolContracts} />,
		addSaturnTemplate !== null && <AddSaturnTemplate key='save-saturn-template' {...addSaturnTemplate} />,
		addNewOptionWatchlist && <AddNewOptionWatchlist key='add-new-option-watchlist' />,
		manageOptionWatchlistList && <ManageOptionWatchlistList key='manage-option-watchlist-list' />,
		buySell && <BuySellModal key='buy-sell-modal' {...buySell} />,
		addSymbolToWatchlist && <AddSymbolToWatchlist key='add-symbol-to-watchlist' {...buySell} />,
	];
};

export default Modals;
