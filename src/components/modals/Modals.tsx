'use client';

import { useAppSelector } from '@/features/hooks';
import ForgetPasswordModal from './ForgetPasswordModal';
import LoginModal from './LoginModal';
import LogoutModal from './Logout';
import OptionWatchlistFiltersModal from './OptionWatchlistFiltersModal';

const Modals = () => {
	const { loginModal, logout, optionFilters, forgetPassword } = useAppSelector((state) => state.modal);

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
	];
};

export default Modals;
