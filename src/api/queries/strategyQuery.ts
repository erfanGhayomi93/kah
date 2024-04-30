import { createQuery } from '@/utils/helpers';
import axios from '../axios';
import routes from '../routes';

export const useGetAllStrategyQuery = createQuery<Strategy.GetAll[], ['getAllStrategyQuery']>({
	staleTime: 36e5,
	queryKey: ['getAllStrategyQuery'],
	queryFn: async ({ signal }) => {
		try {
			const response = await axios.get<ServerResponse<Strategy.GetAll[]>>(routes.strategy.GetAll, {
				signal,
			});
			const { data } = response;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			return data.result;
		} catch (e) {
			return [];
		}
	},
});

export const useCoveredCallQuery = createQuery<Strategy.CoveredCall[], ['coveredCallQuery']>({
	staleTime: 6e5,
	queryKey: ['coveredCallQuery'],
	queryFn: async ({ signal }) => {
		try {
			const params = {
				PageSize: 100,
				PageNumber: 1,
			};

			const response = await axios.get<ServerResponse<Strategy.CoveredCall[]>>(routes.strategy.CoveredCall, {
				signal,
				params,
			});
			const { data } = response;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			return data.result;
		} catch (e) {
			return [];
		}
	},
});

export const useLongCallQuery = createQuery<Strategy.LongCall[], ['longCallQuery']>({
	staleTime: 6e5,
	queryKey: ['longCallQuery'],
	queryFn: async ({ signal }) => {
		try {
			const params = {
				PageSize: 100,
				PageNumber: 1,
			};

			const response = await axios.get<ServerResponse<Strategy.LongCall[]>>(routes.strategy.LongCall, {
				signal,
				params,
			});
			const { data } = response;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			return data.result;
		} catch (e) {
			return [];
		}
	},
});

export const useLongPutQuery = createQuery<Strategy.LongPut[], ['longPutQuery']>({
	staleTime: 6e5,
	queryKey: ['longPutQuery'],
	queryFn: async ({ signal }) => {
		try {
			const params = {
				PageSize: 100,
				PageNumber: 1,
			};

			const response = await axios.get<ServerResponse<Strategy.LongPut[]>>(routes.strategy.LongPut, {
				signal,
				params,
			});
			const { data } = response;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			return data.result;
		} catch (e) {
			return [];
		}
	},
});

export const useBullCallSpreadQuery = createQuery<Strategy.BullCallSpread[], ['bullCallSpreadQuery']>({
	staleTime: 6e5,
	queryKey: ['bullCallSpreadQuery'],
	queryFn: async ({ signal }) => {
		try {
			const params = {
				PageSize: 100,
				PageNumber: 1,
			};

			const response = await axios.get<ServerResponse<Strategy.BullCallSpread[]>>(
				routes.strategy.BullCallSpread,
				{
					signal,
					params,
				},
			);
			const { data } = response;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			return data.result;
		} catch (e) {
			return [];
		}
	},
});
