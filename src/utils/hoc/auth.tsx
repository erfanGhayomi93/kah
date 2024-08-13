'use client';

import ipcMain from '@/classes/IpcMain';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { useAppDispatch } from '@/features/hooks';
import { setChoiceBrokerModal, setLoginModal } from '@/features/slices/modalSlice';
import { redirect } from '@/navigation';
import { useLayoutEffect } from 'react';
import { getBrokerClientId, getClientId } from '../cookie';

type TProps = Record<string | number, unknown>;

type TComponent<T> = (props: T) => React.ReactNode;

const auth = <T extends TProps>(Component: TComponent<T>, callbackUrl = '/', type: 'app' | 'broker' = 'broker') => {
	return (props: T) => {
		const dispatch = useAppDispatch();

		const cookie = type === 'app' ? getClientId() : getBrokerClientId();

		const isAuthenticated = Array.isArray(cookie) ? cookie[0] !== null && cookie[1] !== null : cookie !== null;

		useLayoutEffect(() => {
			if (isAuthenticated) return;

			if (type === 'broker') dispatch(setChoiceBrokerModal({}));
			else dispatch(setLoginModal({}));

			redirect(callbackUrl);

			ipcMain.send('broker:logged_out', undefined);
		}, []);

		if (!isAuthenticated) {
			return null;
		}

		if (!Component) return null;
		return (
			<ErrorBoundary>
				<Component {...props} />
			</ErrorBoundary>
		);
	};
};

export default auth;
