import { getClientId } from '@/utils/cookie';
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
			} else queryParams.push(`${key}=${params[key]}`);
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
	async (error) => {
		if ((error as AxiosError).response !== undefined) {
			// const errStatus = error.response.status;
		}

		return await Promise.reject(error);
	},
);

export { AxiosError };
export default axios;
