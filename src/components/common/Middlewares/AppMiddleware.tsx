'use client';

import { useGetBrokerUrlQuery } from '@/api/queries/brokerQueries';
import LocalstorageInstance from '@/classes/Localstorage';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { getBrokerIsSelected, getIsLoggedIn } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { versionParser } from '@/utils/helpers';
import { createSelector } from '@reduxjs/toolkit';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

interface AppMiddlewareProps {
	children: React.ReactNode;
}

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		isLoggedIn: getIsLoggedIn(state) && getBrokerIsSelected(state),
		brokerURLs: getBrokerURLs(state),
	}),
);

const AppMiddleware = ({ children }: AppMiddlewareProps) => {
	const queryClient = useQueryClient();

	const { isLoggedIn, brokerURLs } = useAppSelector(getStates);

	useGetBrokerUrlQuery({
		queryKey: ['getBrokerUrlQuery'],
		enabled: isLoggedIn,
	});

	const onUserLoggedOutFromTheBroker = () => {
		queryClient.setQueryData(['userInfoQuery'], null);
		queryClient.setQueryData(['userRemainQuery'], null);
		queryClient.setQueryData(['userStatusQuery'], null);
		queryClient.setQueryData(['brokerOrdersCountQuery'], null);
		queryClient.setQueryData(['openOrdersQuery'], null);
		queryClient.setQueryData(['openOrdersQuery'], null);
		queryClient.setQueryData(['executedOrdersQuery'], null);
		queryClient.setQueryData(['draftOrdersQuery'], null);
		queryClient.setQueryData(['optionOrdersQuery'], null);
		queryClient.setQueryData(['commissionsQuery'], null);
	};

	useEffect(() => {
		if (brokerURLs) return;
		onUserLoggedOutFromTheBroker();
	}, [brokerURLs]);

	useEffect(() => {
		try {
			const appVersion = process.env.NEXT_PUBLIC_APP_VERSION;
			if (typeof appVersion !== 'string') return;

			const userAppVersion = LocalstorageInstance.get('app_version', appVersion);

			if (versionParser(appVersion) > versionParser(userAppVersion)) {
				const CLEARABLE_KEYS = [''];
				for (let i = 0; i < CLEARABLE_KEYS.length; i++) {
					LocalstorageInstance.remove(CLEARABLE_KEYS[i]);
				}
			}
		} catch (e) {
			//
		}
	}, []);

	return children;
};

export default AppMiddleware;
