'use client';

import { logoutUser } from '@/api/axios';
import { logoutBroker } from '@/api/brokerAxios';
import { store } from '@/api/inject-store';
import { broadcastChannel } from '@/constants';
import { useAppDispatch } from '@/features/hooks';
import { setChoiceBrokerModal, setLoginModal } from '@/features/slices/modalSlice';
import { getTheme } from '@/features/slices/uiSlice';
import { setBrokerIsSelected, setIsLoggedIn } from '@/features/slices/userSlice';
import { useTranslations } from 'next-intl';
import { useLayoutEffect } from 'react';
import { toast } from 'react-toastify';

interface IBroadcastMessage {
	type: string;
	payload: string;
}

interface BroadcastChannelRegistryProps {
	children: React.ReactNode;
}

const BroadcastChannelRegistry = ({ children }: BroadcastChannelRegistryProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const onBrokerLoggedIn = () => {
		try {
			dispatch(setChoiceBrokerModal(null));
			dispatch(setBrokerIsSelected(true));

			toast.success(t('alerts.logged_in_successfully_to_broker_account'));
		} catch (e) {
			//
		}
	};

	const onAppLoggedIn = () => {
		try {
			dispatch(setLoginModal(null));
			dispatch(setIsLoggedIn(true));
		} catch (e) {
			//
		}
	};

	const onThemeChanged = (payload: string) => {
		try {
			if (!['light', 'dark', 'darkBlue', 'system'].includes(payload)) return;
			const currentTheme = getTheme(store.getState());
			if (currentTheme === payload) return;

			store.dispatch({ payload, type: 'ui/setTheme' });
		} catch (e) {
			//
		}
	};

	const onMessageReceived = ({ isTrusted, origin, type, data }: MessageEvent<unknown>) => {
		try {
			if (!isTrusted || origin !== location.origin || type !== 'message' || typeof data !== 'string') return;

			const realData = JSON.parse(data) as IBroadcastMessage;
			switch (realData.type) {
				case 'broker_logged_in':
					onBrokerLoggedIn();
					break;
				case 'app_logged_in':
					onAppLoggedIn();
					break;
				case 'theme_changed':
					onThemeChanged(realData.payload);
					break;
				case 'app_logout':
					logoutUser(false);
					break;
				case 'broker_logout':
					logoutBroker(false);
					break;
			}
		} catch (e) {
			//
		}
	};

	useLayoutEffect(() => {
		try {
			const channel = new BroadcastChannel(broadcastChannel);

			channel.addEventListener('message', onMessageReceived);

			channel.addEventListener('messageerror', (e) => {
				//
			});
		} catch (e) {
			//
		}
	}, []);

	return children;
};

export default BroadcastChannelRegistry;
