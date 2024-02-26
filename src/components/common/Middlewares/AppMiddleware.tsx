'use client';

import brokerAxios from '@/api/brokerAxios';
import { useGetBrokerUrlQuery } from '@/api/queries/brokerQueries';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setUserRemain, setUserStatus } from '@/features/slices/brokerSlice';
import { getBrokerIsSelected, getIsLoggedIn } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { createSelector } from '@reduxjs/toolkit';
import { useLayoutEffect } from 'react';

interface AppMiddlewareProps {
	children: React.ReactNode;
}

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		isLoggedIn: getIsLoggedIn(state),
		brokerIsSelected: getBrokerIsSelected(state),
	}),
);

const AppMiddleware = ({ children }: AppMiddlewareProps) => {
	const dispatch = useAppDispatch();

	const { isLoggedIn, brokerIsSelected } = useAppSelector(getStates);

	const { data: brokerUrls, refetch: refetchBrokerUrl } = useGetBrokerUrlQuery({
		queryKey: ['getBrokerUrlQuery'],
		enabled: isLoggedIn,
	});

	const fetchUserRemains = async () => {
		try {
			const response = await brokerAxios.get<ServerResponse<Broker.Remain>>(brokerUrls!.userRemain);
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			const { result } = data;

			if (result && typeof result === 'object') dispatch(setUserRemain(data.result));
		} catch (e) {
			//
		}
	};

	const fetchUserStatus = async () => {
		try {
			const response = await brokerAxios.get<ServerResponse<Broker.Status>>(brokerUrls!.userStatus);
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			const { result } = data;

			if (result && typeof result === 'object') dispatch(setUserStatus(data.result));
		} catch (e) {
			//
		}
	};

	useLayoutEffect(() => {
		if (isLoggedIn) refetchBrokerUrl();
	}, [isLoggedIn]);

	useLayoutEffect(() => {
		if (!brokerIsSelected || !brokerUrls) return;

		fetchUserRemains();
		fetchUserStatus();
	}, [brokerIsSelected, brokerUrls]);

	return children;
};

export default AppMiddleware;
