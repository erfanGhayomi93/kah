'use client';

import ipcMain from '@/classes/IpcMain';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { useAppDispatch } from '@/features/hooks';
import { setChoiceBrokerModal, setLoginModal } from '@/features/slices/modalSlice';
import { useRouter } from '@/navigation';
import { useLayoutEffect } from 'react';
import { getBrokerClientId, getClientId } from '../cookie';

type TProps = Record<string | number, unknown>;

type TComponent<T> = (props: T) => React.ReactNode;

const auth = <T extends TProps>(Component: TComponent<T>, callbackUrl = '/', type: 'app' | 'broker' = 'broker') => {
	return (props: T) => {
		const dispatch = useAppDispatch();

		const router = useRouter();

		const cookie = type === 'app' ? getClientId() : getBrokerClientId();

		const isAuthenticated = Array.isArray(cookie) ? cookie[0] !== null && cookie[1] !== null : cookie !== null;

		useLayoutEffect(() => {
			if (isAuthenticated) return;

			if (type === 'broker') dispatch(setChoiceBrokerModal({}));
			else dispatch(setLoginModal({}));

			router.replace(callbackUrl);

			const rm = ipcMain.handle('broker:logged_out', () => {
				router.replace(callbackUrl);
			});

			return () => rm();
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
