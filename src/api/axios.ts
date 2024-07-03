import { store } from '@/api/inject-store';
import ipcMain from '@/classes/IpcMain';
import { deleteBrokerClientId, deleteClientId, getClientId } from '@/utils/cookie';
import AXIOS, { AxiosError, type AxiosResponse } from 'axios';

const axios = AXIOS.create();

axios.defaults.paramsSerializer = {
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

axios.interceptors.request.use(
	(config) => {
		const clientId = getClientId();
		if (clientId) config.headers.Authorization = `Bearer ${clientId}`;

		return config;
	},
	async (error) => {
		return await Promise.reject(error);
	},
);

axios.interceptors.response.use(
	(response: AxiosResponse<ServerResponse>) => {
		return response;
	},
	async (error: AxiosError) => {
		if (error.response) {
			const errStatus = error.response.status;

			switch (errStatus) {
				case 401:
					logoutUser();
			}
		}

		return await Promise.reject(error);
	},
);

const logoutUser = () => {
	try {
		store.dispatch({ payload: false, type: 'user/setIsLoggedIn' });
		store.dispatch({ payload: false, type: 'user/setBrokerIsSelected' });
		store.dispatch({ payload: null, type: 'broker/setBrokerURLs' });

		ipcMain.send('broker:logged_out', undefined);

		deleteBrokerClientId();
		deleteClientId();
	} catch (e) {
		//
	}
};

export { AxiosError, logoutUser };
export default axios;
