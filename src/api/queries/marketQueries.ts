import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { store } from '@/features/store';
import { createQuery } from '@/utils/helpers';
import brokerAxios from '../brokerAxios';

// Market Map
export const useMarketMapQuery = createQuery<MarketMap.Root | null, ['marketMapQuery']>({
	staleTime: 18e5,
	queryKey: ['marketMapQuery'],
	queryFn: async ({ signal }) => {
		try {
			const urls = getBrokerURLs(store.getState());

			if (!urls) return null;

			const response = await brokerAxios.get<ServerResponse<MarketMap.Root>>(urls.getDataProviderv1MarketMap, {
				signal,
			});
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');
			return data.result;
		} catch (e) {
			return null;
		}
	},
});

export const useMarketMapSectorsQuery = createQuery<MarketMap.SectorAPI[] | null, ['marketMapSectorsQuery']>({
	staleTime: 18e5,
	queryKey: ['marketMapSectorsQuery'],
	queryFn: async ({ signal }) => {
		try {
			const urls = getBrokerURLs(store.getState());

			if (!urls) return null;

			const response = await brokerAxios.get<ServerResponse<MarketMap.SectorAPI[]>>(
				urls.getSectorSectorsWithTrades,
				{
					signal,
				},
			);
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');
			return data.result;
		} catch (e) {
			return [];
		}
	},
});
