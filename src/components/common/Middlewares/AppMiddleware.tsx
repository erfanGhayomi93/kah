'use client';

import { useGetBrokerUrlQuery } from '@/api/queries/brokerQueries';
import ipcMain from '@/classes/IpcMain';
import LocalstorageInstance from '@/classes/Localstorage';
import { useAppSelector } from '@/features/hooks';
import { getTheme } from '@/features/slices/uiSlice';
import { getBrokerIsSelected, getIsLoggedIn } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { useBrokerQueryClient } from '@/hooks';
import { setupChart, setupChartColor } from '@/libs/highchart';
import { deleteBrokerClientId } from '@/utils/cookie';
import { versionParser } from '@/utils/helpers';
import { createSelector } from '@reduxjs/toolkit';
import { useEffect } from 'react';

interface AppMiddlewareProps {
	children: React.ReactNode;
}

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		isLoggedIn: getIsLoggedIn(state),
		brokerHasSelected: getBrokerIsSelected(state),
		theme: getTheme(state),
	}),
);

const AppMiddleware = ({ children }: AppMiddlewareProps) => {
	const bQueryClient = useBrokerQueryClient();

	const { isLoggedIn, brokerHasSelected, theme } = useAppSelector(getStates);

	const { refetch } = useGetBrokerUrlQuery({
		queryKey: ['getBrokerUrlQuery'],
		enabled: isLoggedIn && brokerHasSelected,
	});

	const resetQueryClient = () => {
		bQueryClient.clear();
	};

	const setLsVersion = (lsVersion: string) => {
		LocalstorageInstance.clear();
		LocalstorageInstance.set('ls_version', lsVersion);
	};

	const checkLsVersion = () => {
		const lsVersion = process.env.NEXT_PUBLIC_LOCAL_STORAGE_VERSION;
		if (typeof lsVersion !== 'string') return;

		try {
			const userLsVersion = LocalstorageInstance.get<string | undefined>('ls_version', undefined);

			if (userLsVersion && typeof userLsVersion === 'string') {
				if (versionParser(lsVersion) !== versionParser(userLsVersion)) setLsVersion(lsVersion);
			} else {
				setLsVersion(lsVersion);
			}
		} catch (e) {
			setLsVersion(lsVersion);
		}
	};

	useEffect(() => {
		if (!isLoggedIn) deleteBrokerClientId();

		ipcMain.handle('broker:logged_out', resetQueryClient);
		checkLsVersion();
		setupChart();
	}, []);

	useEffect(() => {
		setupChartColor(theme);
	}, [theme]);

	useEffect(() => {
		if (isLoggedIn && brokerHasSelected) refetch();
	}, [isLoggedIn && brokerHasSelected]);

	return children;
};

export default AppMiddleware;
