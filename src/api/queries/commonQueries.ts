import { createQuery } from '@/utils/helpers';
import axios from '../axios';
import routes from '../routes';

export const useTimeQuery = createQuery<string, ['useTimeQuery']>({
	staleTime: 36e5,
	queryKey: ['useTimeQuery'],
	queryFn: async ({ signal }) => {
		try {
			const response = await axios.get<ServerResponse<string>>(routes.common.time, { signal });
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			return data.result;
		} catch (e) {
			return new Date().toISOString();
		}
	},
});

export const useGetBrokersQuery = createQuery<User.Broker[], ['getBrokersQuery']>({
	staleTime: 36e5,
	queryKey: ['getBrokersQuery'],
	queryFn: async ({ signal }) => {
		try {
			const response = await axios.get<ServerResponse<User.Broker[]>>(routes.common.GetBrokers, { signal });
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			return data.result;
		} catch (e) {
			return [];
		}
	},
});
