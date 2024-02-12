'use client';

import { useAppSelector } from '@/features/hooks';
import AddNewOptionWatchlist from './AddNewOptionWatchlist';
import ForgetPasswordModal from './ForgetPasswordModal';
import LoginModal from './LoginModal';
import LogoutModal from './Logout';
import ManageOptionWatchlistList from './ManageOptionWatchlistList';
import OptionWatchlistFiltersModal from './OptionWatchlistFiltersModal';
import SaveSaturnTemplate from './SaveSaturnTemplate';
import SymbolContracts from './SymbolContracts';

const Modals = () => {
	const {
		loginModal,
		logout,
		optionFilters,
		forgetPassword,
		symbolContracts,
		saveSaturnTemplate,
		addNewOptionWatchlist,
		manageOptionWatchlistList,
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
		saveSaturnTemplate !== null && <SaveSaturnTemplate key='save-saturn-template' {...saveSaturnTemplate} />,
		addNewOptionWatchlist && <AddNewOptionWatchlist key='add-new-option-watchlist' />,
		manageOptionWatchlistList && <ManageOptionWatchlistList key='manage-option-watchlist-list' />,
	];
};

export default Modals;
