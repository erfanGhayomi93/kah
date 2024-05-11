import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { setChoiceBrokerModal, setLoginModal } from '@/features/slices/modalSlice';
import { getBrokerIsSelected, getIsLoggedIn } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { createSelector } from '@reduxjs/toolkit';
import { useLayoutEffect } from 'react';

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		isLoggedIn: getIsLoggedIn(state),
		brokerIsSelected: getBrokerIsSelected(state),
		brokerURLs: getBrokerURLs(state),
	}),
);

const useAuthorize = ({ isBroker, enabled }: { isBroker: boolean; enabled: boolean }) => {
	const dispatch = useAppDispatch();

	const { isLoggedIn, brokerIsSelected, brokerURLs } = useAppSelector(getStates);

	const showUserLoginModal = () => {
		dispatch(setLoginModal({}));
	};

	const showBrokerLoginModal = () => {
		dispatch(setChoiceBrokerModal({}));
	};

	useLayoutEffect(() => {
		if (!isLoggedIn && enabled) {
			showUserLoginModal();
			return;
		}

		if (isBroker && !brokerIsSelected && enabled) {
			showBrokerLoginModal();
			return;
		}
	}, [isLoggedIn, brokerIsSelected, brokerURLs]);

	return null;
};

export default useAuthorize;
