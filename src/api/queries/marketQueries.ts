import { store } from '@/api/inject-store';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { createBrokerQuery } from '@/utils/helpers';
import brokerAxios from '../brokerAxios';

// Market Map
export const useMarketMapQuery = createBrokerQuery<MarketMap.Root | null, ['marketMapQuery']>({
	staleTime: 18e5,
	queryKey: ['marketMapQuery'],
	queryFn: async ({ signal }) => {
		try {
			const urls = getBrokerURLs(store.getState());

			if (!urls) return null;

			const response = await brokerAxios.get<ServerResponse<MarketMap.Root>>(urls.MarketMapGet, {
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

export const useMarketMapSectorsQuery = createBrokerQuery<MarketMap.SectorAPI[] | null, ['marketMapSectorsQuery']>({
	staleTime: 18e5,
	queryKey: ['marketMapSectorsQuery'],
	queryFn: async ({ signal }) => {
		try {
			const urls = getBrokerURLs(store.getState());

			if (!urls) return null;

			const response = await brokerAxios.get<ServerResponse<MarketMap.SectorAPI[]>>(urls.MarketMapSectors, {
				signal,
			});
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');
			return data.result;
		} catch (e) {
			return [];
		}
	},
});
