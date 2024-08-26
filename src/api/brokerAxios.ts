import { store } from '@/api/inject-store';
import ipcMain from '@/classes/IpcMain';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import broadcast from '@/utils/broadcast';
import { deleteBrokerClientId, getBrokerClientId } from '@/utils/cookie';
import AXIOS, { AxiosError, type AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

const brokerAxios = AXIOS.create();

brokerAxios.defaults.paramsSerializer = {
	serialize: (params) => {
		const queryParams: string[] = [];
		const keys = Object.keys(params);

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			const value = params[key];

			if (Array.isArray(value)) {
				for (let j = 0; j < value.length; j++) {
					queryParams.push(`${key}=${value[j]}`);
				}
			} else if (value !== undefined) queryParams.push(`${key}=${params[key]}`);
		}

		return queryParams.join('&');
	},
};

brokerAxios.interceptors.request.use(
	(config) => {
		try {
			const [token] = getBrokerClientId();
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		} catch (e) {
			//
		}

		return config;
	},
	async (error) => {
		return await Promise.reject(error);
	},
);

brokerAxios.interceptors.response.use(
	(response: AxiosResponse<ServerResponse>) => {
		return response;
	},
	async (error: AxiosError) => {
		if (error.response) {
			const errStatus = error.response.status;

			switch (errStatus) {
				case 401:
					logoutBroker();
			}
		}

		return await Promise.reject(error);
	},
);

export const logoutBroker = (broadcasting = true) => {
	try {
		const [token] = getBrokerClientId();

		/* Logout from broker */
		try {
			const url = getBrokerURLs(store.getState());
			if (!url) return false;

			brokerAxios.get<ServerResponse<Symbol.Info>>(url.Logout, {
				params: { token },
			});
		} catch (e) {
			//
		}

		/* Clear redux cache */
		store.dispatch({ payload: false, type: 'user/setBrokerIsSelected' });
		store.dispatch({ payload: null, type: 'broker/setBrokerURLs' });

		/* Delete cookie */
		deleteBrokerClientId();

		/* Notification */
		if (token) {
			ipcMain.send('broker:logged_out', undefined);

			toast.warning('از حساب کارگزاری خارج شدید.', {
				toastId: 'broker_unauthorize',
				autoClose: 5000,
			});
		}
	} catch (e) {
		//
	}

	try {
		if (broadcasting) broadcast.postMessage(JSON.stringify({ type: 'broker_logout', payload: null }));
	} catch (e) {
		//
	}
};

export { AxiosError };
export default brokerAxios;
