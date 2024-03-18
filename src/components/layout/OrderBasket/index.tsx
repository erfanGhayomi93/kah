import { useAppSelector } from '@/features/hooks';
import { getIsLoggedIn, getOrderBasket } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { createSelector } from '@reduxjs/toolkit';
import dynamic from 'next/dynamic';

const Basket = dynamic(() => import('./Basket'), {
	ssr: false,
});

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		isLoggedIn: getIsLoggedIn(state),
		orderBasket: getOrderBasket(state),
	}),
);

const OrderBasket = () => {
	const { isLoggedIn, orderBasket } = useAppSelector(getStates);

	if (!isLoggedIn || orderBasket.length === 0) return null;
	return <Basket />;
};

export default OrderBasket;
