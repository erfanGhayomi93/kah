'use client';

import ipcMain from '@/classes/IpcMain';
import OMSGateway from '@/classes/OMSGateway';
import type Order from '@/classes/OMSGateway/Order';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { useUserInfo } from '@/hooks';
import { getBrokerClientId } from '@/utils/cookie';
import { uuidv4 } from '@/utils/helpers';
import { useEffect } from 'react';

const OMSRegistry = () => {
	const brokerURLs = useAppSelector(getBrokerURLs);

	const { data: userInfo } = useUserInfo();

	const createOrder = (fields: IpcMainChannels['send_order']) =>
		new Promise<string | undefined>((resolve) => {
			try {
				if (!brokerURLs) throw new Error();

				const uuid = uuidv4();
				const order = OMSGateway.createOrder()
					.toQueue()
					.setUUID(uuid)
					.setFields(fields)
					.setURL(brokerURLs.OrderCreate);

				OMSGateway.publish().addAndStart([order]);

				resolve(uuid);
			} catch (e) {
				resolve(undefined);
			}
		});

	const createOrders = (fields: IpcMainChannels['send_orders']) => {
		if (!brokerURLs) throw new Error();

		const orders: Order[] = [];
		for (let i = 0; i < fields.length; i++) {
			orders.push(OMSGateway.createOrder().toQueue().setFields(fields[i]).setURL(brokerURLs.OrderCreate));
		}

		OMSGateway.publish().addAndStart(orders);
	};

	useEffect(() => {
		if (!brokerURLs) return;

		const c = new AbortController();

		ipcMain.handle('send_order', createOrder, { async: true, signal: c });
		ipcMain.handle('send_orders', createOrders, { signal: c });

		return () => c.abort();
	}, [brokerURLs]);

	useEffect(() => {
		if (!brokerURLs || !userInfo) return;

		// Subscription
		const [, brokerCode] = getBrokerClientId();
		OMSGateway.subscription().setBrokerCode(String(brokerCode)).setCustomerISIN(userInfo.customerISIN).start();

		// Publish
		OMSGateway.publish().start();
	}, [brokerURLs, userInfo]);

	return null;
};

export default OMSRegistry;
