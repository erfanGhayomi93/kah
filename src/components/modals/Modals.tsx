'use client';

import { useAppSelector } from '@/features/hooks';
import ForgetPasswordModal from './ForgetPasswordModal';
import LoginModal from './LoginModal';
import LogoutModal from './Logout';
import OptionWatchlistFiltersModal from './OptionWatchlistFiltersModal';
import SaveSaturnTemplate from './SaveSaturnTemplate';
import SymbolContracts from './SymbolContracts';

const Modals = () => {
	const { loginModal, logout, optionFilters, forgetPassword, symbolContracts, saveSaturnTemplate } = useAppSelector(
		(state) => state.modal,
	);

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
	];
};

export default Modals;
