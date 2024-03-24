'use client';

import { useGetBrokerUrlQuery } from '@/api/queries/brokerQueries';
import ipcMain from '@/classes/IpcMain';
import OMSGateway from '@/classes/OMSGateway';
import type Order from '@/classes/OMSGateway/Order';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { getBrokerIsSelected, getIsLoggedIn } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { useUserInfo } from '@/hooks';
import { getBrokerClientId } from '@/utils/cookie';
import { createSelector } from '@reduxjs/toolkit';
import { useLayoutEffect } from 'react';

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		isLoggedIn: getIsLoggedIn(state) && getBrokerIsSelected(state),
		brokerURLs: getBrokerURLs(state),
	}),
);

interface OMSMiddlewareProps {
	children: React.ReactNode;
}

const OMSMiddleware = ({ children }: OMSMiddlewareProps) => {
	const { brokerURLs, isLoggedIn } = useAppSelector(getStates);

	useGetBrokerUrlQuery({
		queryKey: ['getBrokerUrlQuery'],
		enabled: isLoggedIn,
	});

	const { data: userInfo } = useUserInfo();

	const createOrder = (fields: IpcMainChannels['send_order']) =>
		new Promise<Order.Response | undefined>((resolve, reject) => {
			try {
				if (!brokerURLs) throw new Error();

				const order = OMSGateway.createOrder().toQueue().setFields(fields).setURL(brokerURLs.createOrder);
				OMSGateway.publish().addAndStart([order]).then(resolve).catch(reject);
			} catch (e) {
				reject();
			}
		});

	const createOrders = (fields: IpcMainChannels['send_orders']) => {
		if (!brokerURLs) throw new Error();

		const orders: Order[] = [];
		for (let i = 0; i < fields.length; i++) {
			orders.push(OMSGateway.createOrder().toQueue().setFields(fields[i]).setURL(brokerURLs.createOrder));
		}

		OMSGateway.publish().addAndStart(orders);
	};

	useLayoutEffect(() => {
		if (!brokerURLs) return;

		ipcMain.handleAsync('send_order', createOrder);
		ipcMain.handle('send_orders', createOrders);

		return () => {
			ipcMain.removeAsyncHandler('send_order');
			ipcMain.removeAsyncHandler('send_orders');
		};
	}, [JSON.stringify(brokerURLs)]);

	useLayoutEffect(() => {
		if (!brokerURLs || !userInfo) return;

		// Subscription
		const [, brokerCode] = getBrokerClientId();
		OMSGateway.subscription().setBrokerCode(String(brokerCode)).setCustomerISIN(userInfo.customerISIN).start();

		// Publish
		OMSGateway.publish().start();
	}, [JSON.stringify(brokerURLs)]);

	return children;
};

export default OMSMiddleware;
