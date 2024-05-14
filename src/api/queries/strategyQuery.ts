import { createQuery } from '@/utils/helpers';
import axios from '../axios';
import routes from '../routes';

type TStrategyBaseType<T> = [T, TPriceBasis, boolean];

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

export const useCoveredCallStrategyQuery = createQuery<Strategy.CoveredCall[], TStrategyBaseType<'coveredCallQuery'>>({
	staleTime: 6e5,
	queryKey: ['coveredCallQuery', 'LastTradePrice', false],
	queryFn: async ({ signal, queryKey }) => {
		try {
			const [, priceBasis, commission] = queryKey;
			const params = {
				PageSize: 100,
				PageNumber: 1,
				CalculateBy: priceBasis,
				WithCommission: commission,
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

export const useLongCallStrategyQuery = createQuery<Strategy.LongCall[], TStrategyBaseType<'longCallQuery'>>({
	staleTime: 6e5,
	queryKey: ['longCallQuery', 'LastTradePrice', false],
	queryFn: async ({ signal, queryKey }) => {
		try {
			const [, priceBasis, commission] = queryKey;
			const params = {
				PageSize: 100,
				PageNumber: 1,
				CalculateBy: priceBasis,
				WithCommission: commission,
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

export const useLongPutStrategyQuery = createQuery<Strategy.LongPut[], TStrategyBaseType<'longPutQuery'>>({
	staleTime: 6e5,
	queryKey: ['longPutQuery', 'LastTradePrice', false],
	queryFn: async ({ signal, queryKey }) => {
		try {
			const [, priceBasis, commission] = queryKey;
			const params = {
				PageSize: 100,
				PageNumber: 1,
				CalculateBy: priceBasis,
				WithCommission: commission,
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

export const useConversionStrategyQuery = createQuery<Strategy.Conversion[], TStrategyBaseType<'conversionQuery'>>({
	staleTime: 6e5,
	queryKey: ['conversionQuery', 'LastTradePrice', false],
	queryFn: async ({ signal, queryKey }) => {
		try {
			const [, priceBasis, commission] = queryKey;
			const params = {
				PageSize: 100,
				PageNumber: 1,
				CalculateBy: priceBasis,
				WithCommission: commission,
			};

			const response = await axios.get<ServerResponse<Strategy.Conversion[]>>(routes.strategy.Conversion, {
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

export const useLongStraddleStrategyQuery = createQuery<
	Strategy.LongStraddle[],
	TStrategyBaseType<'longStraddleQuery'>
>({
	staleTime: 6e5,
	queryKey: ['longStraddleQuery', 'LastTradePrice', false],
	queryFn: async ({ signal, queryKey }) => {
		try {
			const [, priceBasis, commission] = queryKey;
			const params = {
				PageSize: 100,
				PageNumber: 1,
				CalculateBy: priceBasis,
				WithCommission: commission,
			};

			const response = await axios.get<ServerResponse<Strategy.LongStraddle[]>>(routes.strategy.LongStraddle, {
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

export const useBullCallSpreadStrategyQuery = createQuery<
	Strategy.BullCallSpread[],
	TStrategyBaseType<'bullCallSpreadQuery'>
>({
	staleTime: 6e5,
	queryKey: ['bullCallSpreadQuery', 'LastTradePrice', false],
	queryFn: async ({ signal, queryKey }) => {
		try {
			const [, priceBasis, commission] = queryKey;
			const params = {
				PageSize: 100,
				PageNumber: 1,
				CalculateBy: priceBasis,
				WithCommission: commission,
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

export const useBearPutSpreadStrategyQuery = createQuery<
	Strategy.BearPutSpread[],
	TStrategyBaseType<'bearPutSpreadQuery'>
>({
	staleTime: 6e5,
	queryKey: ['bearPutSpreadQuery', 'LastTradePrice', false],
	queryFn: async ({ signal, queryKey }) => {
		try {
			const [, priceBasis, commission] = queryKey;
			const params = {
				PageSize: 100,
				PageNumber: 1,
				CalculateBy: priceBasis,
				WithCommission: commission,
			};

			const response = await axios.get<ServerResponse<Strategy.BearPutSpread[]>>(routes.strategy.BearPutSpread, {
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

export const useProtectivePutStrategyQuery = createQuery<
	Strategy.ProtectivePut[],
	TStrategyBaseType<'protectivePutQuery'>
>({
	staleTime: 6e5,
	queryKey: ['protectivePutQuery', 'LastTradePrice', false],
	queryFn: async ({ signal, queryKey }) => {
		try {
			const [, priceBasis, commission] = queryKey;
			const params = {
				PageSize: 100,
				PageNumber: 1,
				CalculateBy: priceBasis,
				WithCommission: commission,
			};

			const response = await axios.get<ServerResponse<Strategy.ProtectivePut[]>>(routes.strategy.ProtectivePut, {
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
