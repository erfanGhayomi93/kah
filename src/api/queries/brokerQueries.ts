import { store } from '@/api/inject-store';
import { setBrokerURLs } from '@/features/slices/brokerSlice';
import { getBrokerClientId } from '@/utils/cookie';
import { createQuery, decodeBrokerUrls } from '@/utils/helpers';
import axios from '../axios';
import routes from '../routes';

export const useGetBrokerUrlQuery = createQuery<IBrokerUrls | null, ['getBrokerUrlQuery']>({
	staleTime: 36e5,
	queryKey: ['getBrokerUrlQuery'],
	queryFn: async ({ signal }) => {
		const [, brokerCode] = getBrokerClientId();
		if (!brokerCode || brokerCode <= 0) return null;

		try {
			const response = await axios.get<ServerResponse<Broker.URL>>(routes.common.GetBrokerApiUrls, {
				params: {
					brokerCode: brokerCode ?? 189,
				},
				signal,
			});
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			const urls = decodeBrokerUrls(data.result);

			store.dispatch(setBrokerURLs(urls));

			return urls;
		} catch (e) {
			return null;
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
