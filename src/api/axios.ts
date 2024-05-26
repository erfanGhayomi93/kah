import { store } from '@/api/inject-store';
import { deleteBrokerClientId, deleteClientId, getClientId } from '@/utils/cookie';
import AXIOS, { AxiosError, type AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

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

		const clientId = getClientId();
		deleteBrokerClientId();
		deleteClientId();

		if (clientId) {
			toast.warning('متاسفانه از حساب خود خارج شدید.', {
				toastId: 'broker_unauthorize',
				autoClose: 5000,
			});
		}
	} catch (e) {
		//
	}
};

export { AxiosError, logoutUser };
export default axios;
