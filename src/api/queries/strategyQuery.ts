import { createQuery } from '@/utils/helpers';
import axios from '../axios';
import routes from '../routes';

type TParams = Record<string, string | number | boolean | string[] | number[]>;

interface IStrategyOptionsKey {
	priceBasis: TPriceBasis;
	symbolBasis: TStrategySymbolBasis;
	withCommission: boolean;
}

const CACHE_TIME = 0;

const defaultStrategyOptions: IStrategyOptionsKey = {
	priceBasis: 'BestLimitPrice',
	symbolBasis: 'BestLimit',
	withCommission: true,
};

export const useGetAllStrategyQuery = createQuery<Strategy.GetAll[], ['getAllStrategyQuery']>({
	staleTime: CACHE_TIME,
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

export const useCoveredCallStrategyQuery = createQuery<
	Strategy.CoveredCall[],
	['coveredCallQuery', IStrategyOptionsKey, Partial<ICoveredCallFiltersModalStates>]
>({
	staleTime: CACHE_TIME,
	queryKey: ['coveredCallQuery', defaultStrategyOptions, {}],
	queryFn: async ({ signal, queryKey }) => {
		try {
			const [, { priceBasis, symbolBasis, withCommission }, filters] = queryKey;
			const params: TParams = {
				PageSize: 100,
				PageNumber: 1,
				PriceType: priceBasis,
				SymbolBasis: symbolBasis,
				WithCommission: withCommission,
			};

			if (filters?.baseSymbols && filters.baseSymbols.length > 0)
				params.BaseSymbolISIN = filters.baseSymbols.map((item) => item.symbolISIN);

			if (filters?.iotm && filters.iotm.length > 0) params.IOTM = filters.iotm.map((item) => item);

			if (filters?.dueDays) {
				if (typeof filters.dueDays[0] === 'number') params.FromDueDays = filters.dueDays[0];
				if (typeof filters.dueDays[1] === 'number') params.ToDueDays = filters.dueDays[1];
			}

			if (filters?.openPosition) params.LeastOpenPositions = filters.openPosition;

			if (filters?.maxProfit && filters.maxProfit) params.LeastMaxProfitPercent = filters.maxProfit;

			if (filters?.nonExpiredProfit) params.LeastNonExpiredProfitPercent = filters.nonExpiredProfit;

			if (filters?.riskCoverage) params.LeastRiskCoverage = filters.riskCoverage;

			if (filters?.ytm) params.LeastYTM = filters.ytm;

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

export const useLongCallStrategyQuery = createQuery<
	Strategy.LongCall[],
	['longCallQuery', IStrategyOptionsKey, Partial<ILongCallFiltersModalState>]
>({
	staleTime: CACHE_TIME,
	queryKey: ['longCallQuery', defaultStrategyOptions, {}],
	queryFn: async ({ signal, queryKey }) => {
		try {
			const [, { priceBasis, symbolBasis, withCommission }, filters] = queryKey;
			const params: TParams = {
				PageSize: 100,
				PageNumber: 1,
				PriceType: priceBasis,
				SymbolBasis: symbolBasis,
				WithCommission: withCommission,
			};

			if (filters?.baseSymbols && filters.baseSymbols.length > 0)
				params.BaseSymbolISIN = filters.baseSymbols.map((item) => item.symbolISIN);

			if (filters?.iotm && filters.iotm.length > 0) params.IOTM = filters.iotm.map((item) => item);

			if (filters?.dueDays) {
				if (typeof filters.dueDays[0] === 'number') params.FromDueDays = filters.dueDays[0];
				if (typeof filters.dueDays[1] === 'number') params.ToDueDays = filters.dueDays[1];
			}

			if (filters?.bepDifference) {
				if (typeof filters.bepDifference[0] === 'number') params.FromBEPDifference = filters.bepDifference[0];
				if (typeof filters.bepDifference[1] === 'number') params.ToBEPDifference = filters.bepDifference[1];
			}

			if (filters?.openPosition) params.LeastOpenPositions = filters.openPosition;

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

export const useLongPutStrategyQuery = createQuery<
	Strategy.LongPut[],
	['longPutQuery', IStrategyOptionsKey, Partial<ILongPutFiltersModalState>]
>({
	staleTime: CACHE_TIME,
	queryKey: ['longPutQuery', defaultStrategyOptions, {}],
	queryFn: async ({ signal, queryKey }) => {
		try {
			const [, { priceBasis, symbolBasis, withCommission }, filters] = queryKey;
			const params: TParams = {
				PageSize: 100,
				PageNumber: 1,
				PriceType: priceBasis,
				SymbolBasis: symbolBasis,
				WithCommission: withCommission,
			};

			if (filters?.baseSymbols && filters.baseSymbols.length > 0)
				params.BaseSymbolISIN = filters.baseSymbols.map((item) => item.symbolISIN);

			if (filters?.iotm && filters.iotm.length > 0) params.IOTM = filters.iotm.map((item) => item);

			if (filters?.dueDays) {
				if (typeof filters.dueDays[0] === 'number') params.FromDueDays = filters.dueDays[0];
				if (typeof filters.dueDays[1] === 'number') params.ToDueDays = filters.dueDays[1];
			}

			if (filters?.bepDifference) {
				if (typeof filters.bepDifference[0] === 'number') params.FromEPDifference = filters.bepDifference[0];
				if (typeof filters.bepDifference[1] === 'number') params.ToBEPDifference = filters.bepDifference[1];
			}

			if (filters?.openPosition) params.LeastOpenPositions = filters.openPosition;

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

export const useConversionStrategyQuery = createQuery<
	Strategy.Conversion[],
	['conversionQuery', IStrategyOptionsKey, Partial<IConversionFiltersModalState>]
>({
	staleTime: CACHE_TIME,
	queryKey: ['conversionQuery', defaultStrategyOptions, {}],
	queryFn: async ({ signal, queryKey }) => {
		try {
			const [, { priceBasis, symbolBasis, withCommission }, filters] = queryKey;
			const params: TParams = {
				PageSize: 100,
				PageNumber: 1,
				PriceType: priceBasis,
				SymbolBasis: symbolBasis,
				WithCommission: withCommission,
			};

			if (filters?.baseSymbols && filters.baseSymbols.length > 0)
				params.BaseSymbolISIN = filters.baseSymbols.map((item) => item.symbolISIN);

			if (filters?.callIOTM && filters.callIOTM.length > 0)
				params.CallIOTM = filters.callIOTM.map((item) => item);
			if (filters?.putIOTM && filters.putIOTM.length > 0) params.PutIOTM = filters.putIOTM.map((item) => item);

			if (filters?.dueDays) {
				if (typeof filters.dueDays[0] === 'number') params.FromDueDays = filters.dueDays[0];
				if (typeof filters.dueDays[1] === 'number') params.ToDueDays = filters.dueDays[1];
			}

			if (filters.callLeastOpenPositions) params.CallLeastOpenPositions = filters.callLeastOpenPositions;
			if (filters.putLeastOpenPositions) params.PutLeastOpenPositions = filters.putLeastOpenPositions;

			if (filters.leastProfitPercent) params.LeastProfitPercent = filters.leastProfitPercent;

			if (filters.leastYTM) params.LeastYTM = filters.leastYTM;

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
	['longStraddleQuery', IStrategyOptionsKey, Partial<ILongStraddleFiltersModalStates>]
>({
	staleTime: CACHE_TIME,
	queryKey: ['longStraddleQuery', defaultStrategyOptions, {}],
	queryFn: async ({ signal, queryKey }) => {
		try {
			const [, { priceBasis, symbolBasis, withCommission }, filters] = queryKey;
			const params: TParams = {
				PageSize: 100,
				PageNumber: 1,
				PriceType: priceBasis,
				SymbolBasis: symbolBasis,
				WithCommission: withCommission,
			};

			if (filters?.baseSymbols && filters.baseSymbols.length > 0)
				params.BaseSymbolISIN = filters.baseSymbols.map((item) => item.symbolISIN);

			if (filters?.callIOTM && filters.callIOTM.length > 0)
				params.CallIOTM = filters.callIOTM.map((item) => item);

			if (filters?.putIOTM && filters.putIOTM.length > 0) params.PutIOTM = filters.putIOTM.map((item) => item);

			if (filters?.dueDays) {
				if (typeof filters.dueDays[0] === 'number') params.FromDueDays = filters.dueDays[0];
				if (typeof filters.dueDays[1] === 'number') params.ToDueDays = filters.dueDays[1];
			}

			if (filters?.callOpenPosition) params.CallLeastOpenPositions = filters.callOpenPosition;
			if (filters?.putOpenPosition) params.PutLeastOpenPositions = filters.putOpenPosition;

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
	['bullCallSpreadQuery', IStrategyOptionsKey, Partial<IBullCallSpreadFiltersModalState>]
>({
	staleTime: CACHE_TIME,
	queryKey: ['bullCallSpreadQuery', defaultStrategyOptions, {}],
	queryFn: async ({ signal, queryKey }) => {
		try {
			const [, { priceBasis, symbolBasis, withCommission }, filters] = queryKey;
			const params: TParams = {
				PageSize: 100,
				PageNumber: 1,
				PriceType: priceBasis,
				SymbolBasis: symbolBasis,
				WithCommission: withCommission,
			};

			if (filters?.baseSymbols && filters.baseSymbols.length > 0)
				params.BaseSymbolISIN = filters.baseSymbols.map((item) => item.symbolISIN);

			if (filters?.HSPIOTM && filters.HSPIOTM.length > 0) params.HSPIOTM = filters.HSPIOTM.map((item) => item);
			if (filters?.LSPIOTM && filters.LSPIOTM.length > 0) params.LSPIOTM = filters.LSPIOTM.map((item) => item);

			if (filters?.dueDays) {
				if (typeof filters.dueDays[0] === 'number') params.FromDueDays = filters.dueDays[0];
				if (typeof filters.dueDays[1] === 'number') params.ToDueDays = filters.dueDays[1];
			}

			if (filters.HSPLeastOpenPositions) params.HSPLeastOpenPositions = filters.HSPLeastOpenPositions;
			if (filters.LSPLeastOpenPositions) params.LSPLeastOpenPositions = filters.LSPLeastOpenPositions;

			if (filters.leastMaxProfitPercent) params.LeastMaxProfitPercent = filters.leastMaxProfitPercent;

			if (filters.leastYTM) params.LeastYTM = filters.leastYTM;

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
	['bearPutSpreadQuery', IStrategyOptionsKey, Partial<IBearPutSpreadSpreadFiltersModalState>]
>({
	staleTime: CACHE_TIME,
	queryKey: ['bearPutSpreadQuery', defaultStrategyOptions, {}],
	queryFn: async ({ signal, queryKey }) => {
		try {
			const [, { priceBasis, symbolBasis, withCommission }, filters] = queryKey;
			const params: TParams = {
				PageSize: 100,
				PageNumber: 1,
				PriceType: priceBasis,
				SymbolBasis: symbolBasis,
				WithCommission: withCommission,
			};

			if (filters?.baseSymbols && filters.baseSymbols.length > 0)
				params.BaseSymbolISIN = filters.baseSymbols.map((item) => item.symbolISIN);

			if (filters?.HSPIOTM && filters.HSPIOTM.length > 0) params.HSPIOTM = filters.HSPIOTM.map((item) => item);
			if (filters?.LSPIOTM && filters.LSPIOTM.length > 0) params.LSPIOTM = filters.LSPIOTM.map((item) => item);

			if (filters?.dueDays) {
				if (typeof filters.dueDays[0] === 'number') params.FromDueDays = filters.dueDays[0];
				if (typeof filters.dueDays[1] === 'number') params.ToDueDays = filters.dueDays[1];
			}

			if (filters.HSPLeastOpenPositions) params.HSPLeastOpenPositions = filters.HSPLeastOpenPositions;
			if (filters.LSPLeastOpenPositions) params.LSPLeastOpenPositions = filters.LSPLeastOpenPositions;

			if (filters.leastMaxProfitPercent) params.LeastMaxProfitPercent = filters.leastMaxProfitPercent;

			if (filters.leastYTM) params.LeastYTM = filters.leastYTM;

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
	['protectivePutQuery', IStrategyOptionsKey, Partial<IProtectivePutFiltersModalState>]
>({
	staleTime: CACHE_TIME,
	queryKey: ['protectivePutQuery', defaultStrategyOptions, {}],
	queryFn: async ({ signal, queryKey }) => {
		try {
			const [, { priceBasis, symbolBasis, withCommission }, filters] = queryKey;
			const params: TParams = {
				PageSize: 100,
				PageNumber: 1,
				PriceType: priceBasis,
				SymbolBasis: symbolBasis,
				WithCommission: withCommission,
			};

			if (filters?.baseSymbols && filters.baseSymbols.length > 0)
				params.BaseSymbolISIN = filters.baseSymbols.map((item) => item.symbolISIN);

			if (filters?.iotm && filters.iotm.length > 0) params.IOTM = filters.iotm.map((item) => item);

			if (filters?.dueDays) {
				if (typeof filters.dueDays[0] === 'number') params.FromDueDays = filters.dueDays[0];
				if (typeof filters.dueDays[1] === 'number') params.ToDueDays = filters.dueDays[1];
			}

			if (filters?.openPosition) params.LeastOpenPositions = filters.openPosition;

			if (filters?.maxLoss) params.MostMaxLossPercent = filters.maxLoss;

			if (filters?.bepDifference) {
				if (typeof filters.bepDifference[0] === 'number') params.FromBEPDifference = filters.bepDifference[0];
				if (typeof filters.bepDifference[1] === 'number') params.ToBEPDifference = filters.bepDifference[1];
			}

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
