'use client';

import broadcast from '@/utils/broadcast';
import { setBrokerClientId } from '@/utils/cookie';
import { useEffect } from 'react';
import Loading from '../common/Loading';

const Authorize = () => {
	useEffect(() => {
		try {
			if (process.env.NODE_ENV !== 'production') throw new Error('It works only in Production');

			const params = new URLSearchParams(location.search);

			const brokerCode = params.get('brokerCode') ?? '';
			let clientId = params.get('client_id') ?? '';
			clientId = clientId.replace(/\s/gi, '+');

			if (clientId && brokerCode) {
				try {
					setBrokerClientId(`${clientId}^${brokerCode}`);

					if (process.env.NODE_ENV === 'production') {
						broadcast.postMessage(JSON.stringify({ type: 'broker_registered', payload: clientId }));
					}
				} catch (e) {
					//
				}
			}
		} catch (e) {
			//
		} finally {
			if (process.env.NODE_ENV === 'production') window.close();
		}
	}, []);

	return (
		<div className='p-8'>
			<div className='size-full rounded bg-white flex-justify-center darkBlue:bg-gray-50 dark:bg-gray-50'>
				<Loading />
			</div>
		</div>
	);
};

export default Authorize;
