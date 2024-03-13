import Loading from '@/components/common/Loading';
import { useAppSelector } from '@/features/hooks';
import { getBrokerIsSelected, getIsLoggedIn } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { createSelector } from '@reduxjs/toolkit';
import dynamic from 'next/dynamic';

const Container = dynamic(() => import('./Container'), {
	ssr: false,
	loading: () => <Loading />,
});

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		isLoggedIn: getIsLoggedIn(state) && getBrokerIsSelected(state),
	}),
);

const Orders = () => {
	const { isLoggedIn } = useAppSelector(getStates);

	if (!isLoggedIn) return null;
	return <Container />;
};

export default Orders;
