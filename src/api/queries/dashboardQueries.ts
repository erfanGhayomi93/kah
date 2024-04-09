import { createQuery } from '@/utils/helpers';
import axios from '../axios';
import routes from '../routes';

export const useGetMarketStateQuery = createQuery<
	Dashboard.GetMarketState.All,
	['getMarketStateQuery', Dashboard.TMarketStateExchange]
>({
	staleTime: 6e5,
	queryKey: ['getMarketStateQuery', 'Bourse'],
	queryFn: async ({ signal, queryKey }) => {
		const [, exchange] = queryKey;

		const response = await axios.get<ServerResponse<Dashboard.GetMarketState.All>>(
			routes.dashboard.GetMarketState,
			{
				params: { exchange },
				signal,
			},
		);
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useGetIndexQuery = createQuery<Dashboard.GetIndex.All, ['getIndexQuery', Dashboard.TIndexType]>({
	staleTime: 6e5,
	queryKey: ['getIndexQuery', 'Overall'],
	queryFn: async ({ signal, queryKey }) => {
		const [, indexType] = queryKey;

		const response = await axios.get<ServerResponse<Dashboard.GetIndex.All>>(routes.dashboard.GetIndex, {
			params: { indexType },
			signal,
		});
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});
