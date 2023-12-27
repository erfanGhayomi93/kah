'use client';

import { useAppSelector } from '@/features/hooks';
import LoginModal from './LoginModal';

const Modals = () => {
	const { loginModal, forgetPassword } = useAppSelector((state) => state.modal);

	return [loginModal && <LoginModal key='login-modal' />];
};

export default Modals;
