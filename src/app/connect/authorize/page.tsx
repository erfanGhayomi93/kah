'use client';

import { broadcastChannel } from '@/constants';
import { setBrokerClientId } from '@/utils/cookie';
import type { NextPage } from 'next';
import { useLayoutEffect } from 'react';

const Page: NextPage<INextProps> = () => {
	useLayoutEffect(() => {
		try {
			const params = new URLSearchParams(location.search);

			let clientId = params.get('client_id') ?? '';
			clientId = clientId.replace(/\s/gi, '+');

			if (clientId) {
				setBrokerClientId(clientId);

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
			if (process.env.NODE_ENV !== 'development') window.close();
		}
	}, []);

	return null;
};

export default Page;
