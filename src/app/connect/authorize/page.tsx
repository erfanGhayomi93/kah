'use client';

import { broadcastChannel } from '@/constants';
import { setBrokerClientId } from '@/utils/cookie';
import type { NextPage } from 'next';
import { useEffect } from 'react';

const Page: NextPage<INextProps> = () => {
	useEffect(() => {
		try {
			const params = new URLSearchParams(location.search);

			const brokerCode = params.get('brokerCode') ?? '';
			let clientId = params.get('client_id') ?? '';
			clientId = clientId.replace(/\s/gi, '+');

			if (clientId && brokerCode) {
				setBrokerClientId(`${clientId}^${brokerCode}`);

				try {
					const channel = new BroadcastChannel(broadcastChannel);
					channel.postMessage(JSON.stringify({ type: 'broker_registered', payload: clientId }));
				} catch (e) {
					//
				}
			}
		} catch (e) {
			//
		} finally {
			window.close();
		}
	}, []);

	return null;
};

export default Page;
