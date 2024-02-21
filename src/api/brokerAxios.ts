import { setBrokerIsSelected } from '@/features/slices/userSlice';
import { store } from '@/features/store';
import { deleteBrokerClientId, getBrokerClientId } from '@/utils/cookie';
import AXIOS, { AxiosError, type AxiosResponse } from 'axios';

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
			} else queryParams.push(`${key}=${params[key]}`);
		}

		return queryParams.join('&');
	},
};

brokerAxios.interceptors.request.use(
	(config) => {
		const clientId = getBrokerClientId();
		if (clientId) config.headers.Authorization = `Bearer ${clientId}`;

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
					onUnauthorize();
			}
		}

		return await Promise.reject(error);
	},
);

export const onUnauthorize = () => {
	try {
		store.dispatch(setBrokerIsSelected(false));
		deleteBrokerClientId();
	} catch (e) {
		//
	}
};

export { AxiosError };
export default brokerAxios;
