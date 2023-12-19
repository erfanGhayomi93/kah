'use client';

import { useAppSelector } from '@/features/hooks';
import AuthenticationModal from './AuthenticationModal';

const Modals = () => {
	const { authenticationModal } = useAppSelector((state) => state.modal);

	return [authenticationModal && <AuthenticationModal />];
};

export default Modals;
