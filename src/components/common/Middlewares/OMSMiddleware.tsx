'use client';

import brokerAxios from '@/api/brokerAxios';
import { useGetBrokerUrlQuery } from '@/api/queries/brokerQueries';
import ipcMain from '@/classes/IpcMain';
import OMSGateway from '@/classes/OMSGateway';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getUserInfo, setUserInfo, setUserRemain, setUserStatus } from '@/features/slices/brokerSlice';
import { getBrokerIsSelected, getIsLoggedIn } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { getBrokerClientId } from '@/utils/cookie';
import { createSelector } from '@reduxjs/toolkit';
import { useLayoutEffect } from 'react';

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		isLoggedIn: getIsLoggedIn(state),
		userInfo: getUserInfo(state),
		brokerIsSelected: getBrokerIsSelected(state),
	}),
);

interface OMSMiddlewareProps {
	children: React.ReactNode;
}

const OMSMiddleware = ({ children }: OMSMiddlewareProps) => {
	const dispatch = useAppDispatch();

	const { userInfo, isLoggedIn, brokerIsSelected } = useAppSelector(getStates);

	const { data: brokerUrls } = useGetBrokerUrlQuery({
		queryKey: ['getBrokerUrlQuery'],
		enabled: isLoggedIn,
	});

	const fetchUserInfo = async () => {
		try {
			const response = await brokerAxios.get<ServerResponse<Broker.User>>(brokerUrls!.userInformation);
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			const { result } = data;

			if (result && typeof result === 'object') dispatch(setUserInfo(data.result));
		} catch (e) {
			//
		}
	};

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

	const createOrder = (fields: IpcMainChannels['send_order']) =>
		new Promise<Order.Response>((resolve, reject) => {
			try {
				if (!brokerUrls) throw new Error();

				const order = OMSGateway.createOrder().toQueue().setFields(fields).setURL(brokerUrls.createOrder);
				OMSGateway.publish().add([order], { startSending: true, force: false });

				reject();
			} catch (e) {
				reject();
			}
		});

	useLayoutEffect(() => {
		if (!brokerUrls) return;
		ipcMain.handleAsync('send_order', createOrder);

		return () => {
			ipcMain.removeAsyncHandler('send_order');
		};
	}, [JSON.stringify(brokerUrls)]);

	useLayoutEffect(() => {
		if (!brokerIsSelected || !brokerUrls) return;

		fetchUserInfo();
		fetchUserRemains();
		fetchUserStatus();
	}, [brokerIsSelected, brokerUrls]);

	useLayoutEffect(() => {
		if (!userInfo) return;

		// Subscription
		const [, brokerCode] = getBrokerClientId();
		OMSGateway.subscription().setBrokerCode(String(brokerCode)).setCustomerISIN(userInfo.customerISIN).start();

		// Publish
		OMSGateway.publish().start();
	}, [JSON.stringify(userInfo)]);

	return children;
};

export default OMSMiddleware;
