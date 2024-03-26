import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { toggleChoiceBrokerModal, toggleLoginModal } from '@/features/slices/modalSlice';
import { getBrokerIsSelected, getIsLoggedIn } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { createSelector } from '@reduxjs/toolkit';
import { useLayoutEffect, useState } from 'react';

interface AuthorizeModalMiddlewareProps {
	broker?: boolean;
	children: React.ReactNode;
}

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		isLoggedIn: getIsLoggedIn(state),
		brokerIsSelected: getBrokerIsSelected(state),
		brokerURLs: getBrokerURLs(state),
	}),
);

const AuthorizeModalMiddleware = ({ broker, children }: AuthorizeModalMiddlewareProps) => {
	const dispatch = useAppDispatch();

	const [checking, setChecking] = useState(true);

	const { isLoggedIn, brokerIsSelected, brokerURLs } = useAppSelector(getStates);

	const showUserLoginModal = () => {
		dispatch(toggleLoginModal({}));
	};

	const showBrokerLoginModal = () => {
		dispatch(toggleChoiceBrokerModal({}));
	};

	useLayoutEffect(() => {
		if (broker) {
			if (isLoggedIn) {
				if (brokerIsSelected) setChecking(false);
				else showBrokerLoginModal();
			} else showUserLoginModal();
		} else {
			if (isLoggedIn) setChecking(false);
			else showUserLoginModal();
		}
	}, [isLoggedIn, brokerIsSelected, brokerURLs]);

	if (checking) return null;
	return children;
};

export default AuthorizeModalMiddleware;
