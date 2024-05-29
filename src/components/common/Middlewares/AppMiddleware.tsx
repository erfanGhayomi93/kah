'use client';

import { useGetBrokerUrlQuery } from '@/api/queries/brokerQueries';
import ipcMain from '@/classes/IpcMain';
import LocalstorageInstance from '@/classes/Localstorage';
import { useAppSelector } from '@/features/hooks';
import { getBrokerIsSelected, getIsLoggedIn } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { useBrokerQueryClient } from '@/hooks';
import { versionParser } from '@/utils/helpers';
import { createSelector } from '@reduxjs/toolkit';
import { useEffect } from 'react';

interface AppMiddlewareProps {
	children: React.ReactNode;
}

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		isLoggedIn: getIsLoggedIn(state) && getBrokerIsSelected(state),
	}),
);

const AppMiddleware = ({ children }: AppMiddlewareProps) => {
	const bQueryClient = useBrokerQueryClient();

	const { isLoggedIn } = useAppSelector(getStates);

	useGetBrokerUrlQuery({
		queryKey: ['getBrokerUrlQuery'],
		enabled: isLoggedIn,
	});

	const resetQueryClient = () => {
		bQueryClient.clear();
	};

	useEffect(() => {
		ipcMain.handle('broker:logged_out', resetQueryClient);
	}, []);

	useEffect(() => {
		try {
			const appVersion = process.env.NEXT_PUBLIC_APP_VERSION;
			if (typeof appVersion !== 'string') return;

			const userAppVersion = LocalstorageInstance.get('app_version', appVersion);

			if (versionParser(appVersion) !== versionParser(userAppVersion)) {
				const CLEARABLE_KEYS = [
					'conversion_strategy_columns',
					'bear_put_spread_columns',
					'bull_call_spread_strategy_columns',
					'covered_call_strategy_columns',
					'long_call_strategy_columns',
					'long_put_strategy_columns',
					'Long_straddle_strategy_columns',
					'protective_put_strategy_columns',
				];
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
