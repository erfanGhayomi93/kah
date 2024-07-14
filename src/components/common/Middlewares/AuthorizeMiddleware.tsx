import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { setChoiceBrokerModal, setLoginModal } from '@/features/slices/modalSlice';
import { getBrokerIsSelected, getIsLoggedIn } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { createSelector } from '@reduxjs/toolkit';
import { cloneElement, forwardRef, useEffect, useState } from 'react';

interface AuthorizeMiddlewareProps {
	broker?: boolean;
	children: React.ReactElement;
	callback?: () => void;
}

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		isLoggedIn: getIsLoggedIn(state),
		brokerIsSelected: getBrokerIsSelected(state),
		brokerURLs: getBrokerURLs(state),
	}),
);

const AuthorizeMiddleware = forwardRef<HTMLElement, AuthorizeMiddlewareProps>(({ broker, children, callback }, ref) => {
	const dispatch = useAppDispatch();

	const [checking, setChecking] = useState(true);

	const { isLoggedIn, brokerIsSelected, brokerURLs } = useAppSelector(getStates);

	const showUserLoginModal = () => {
		dispatch(
			setLoginModal({
				showForceLoginAlert: true,
				callbackFunction: () => {
					if (broker) showBrokerLoginModal();
				},
			}),
		);
	};

	const showBrokerLoginModal = () => {
		dispatch(setChoiceBrokerModal({}));
	};

	useEffect(() => {
		if (!isLoggedIn) {
			showUserLoginModal();
			callback?.();
			return;
		}

		if (broker && !brokerIsSelected) {
			showBrokerLoginModal();
			callback?.();
			return;
		}

		setChecking(false);
	}, [isLoggedIn, brokerIsSelected, brokerURLs]);

	if (checking) return null;
	return cloneElement(children, { ref });
});

export default AuthorizeMiddleware;
