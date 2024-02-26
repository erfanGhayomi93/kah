import { useAppDispatch, useAppSelector } from '@/features/hooks';
import {
	toggleBuySellModal,
	toggleChooseBrokerModal,
	toggleLoginModal,
	type IBuySellModal,
} from '@/features/slices/modalSlice';
import { getBrokerIsSelected, getIsLoggedIn } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { createSelector } from '@reduxjs/toolkit';

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		isLoggedIn: getIsLoggedIn(state),
		brokerIsSelected: getBrokerIsSelected(state),
	}),
);

const useTradingFeatures = () => {
	const dispatch = useAppDispatch();

	const { isLoggedIn, brokerIsSelected } = useAppSelector(getStates);

	const addBuySellModal = (props: IBuySellModal) => {
		if (!isLoggedIn) {
			dispatch(toggleLoginModal({}));
		} else if (!brokerIsSelected) {
			dispatch(toggleChooseBrokerModal({}));
		} else {
			dispatch(toggleBuySellModal(props));
		}
	};

	return { addBuySellModal };
};

export default useTradingFeatures;
