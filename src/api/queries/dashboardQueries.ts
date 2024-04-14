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

export const useGetIndexQuery = createQuery<
	Dashboard.GetIndex.All,
	['getIndexQuery', Dashboard.TInterval, Dashboard.TIndexType]
>({
	staleTime: 6e5,
	queryKey: ['getIndexQuery', 'Today', 'Overall'],
	queryFn: async ({ signal, queryKey }) => {
		const [, chartIntervalType, indexType] = queryKey;

		const response = await axios.get<ServerResponse<Dashboard.GetIndex.All>>(routes.dashboard.GetIndex, {
			params: { chartIntervalType, indexType },
			signal,
		});
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useGetOptionTopSymbolsQuery = createQuery<
	Dashboard.GetTopSymbols.Option.AllAsArray,
	['getOptionTopSymbolsQuery', Dashboard.GetTopSymbols.Option.Type]
>({
	staleTime: 6e5,
	queryKey: ['getOptionTopSymbolsQuery', 'OptionOpenPosition'],
	queryFn: async ({ signal, queryKey }) => {
		const [, type] = queryKey;

		const response = await axios.get<ServerResponse<Dashboard.GetTopSymbols.Option.AllAsArray>>(
			routes.dashboard.GetOptionTopSymbols,
			{
				params: { type },
				signal,
			},
		);
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useGetBaseTopSymbolsQuery = createQuery<
	Dashboard.GetTopSymbols.BaseSymbol.AllAsArray,
	['getBaseTopSymbolsQuery', Dashboard.GetTopSymbols.BaseSymbol.Type]
>({
	staleTime: 6e5,
	queryKey: ['getBaseTopSymbolsQuery', 'BaseSymbolCallOpenPosition'],
	queryFn: async ({ signal, queryKey }) => {
		const [, type] = queryKey;

		const response = await axios.get<ServerResponse<Dashboard.GetTopSymbols.BaseSymbol.AllAsArray>>(
			routes.dashboard.GetBaseTopSymbols,
			{
				params: { type },
				signal,
			},
		);
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useGetTopSymbolsQuery = createQuery<
	Dashboard.GetTopSymbols.Symbol.AllAsArray,
	['getTopSymbolsQuery', Dashboard.GetTopSymbols.Symbol.Type]
>({
	staleTime: 6e5,
	queryKey: ['getTopSymbolsQuery', 'SymbolValue'],
	queryFn: async ({ signal, queryKey }) => {
		const [, type] = queryKey;

		const response = await axios.get<ServerResponse<Dashboard.GetTopSymbols.Symbol.AllAsArray>>(
			routes.dashboard.GetTopSymbols,
			{
				params: { type },
				signal,
			},
		);
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useGetOptionContractAdditionalInfoQuery = createQuery<
	Dashboard.GetOptionContractAdditionalInfo.All,
	['getOptionContractAdditionalInfoQuery', Dashboard.GetOptionContractAdditionalInfo.Type]
>({
	staleTime: 6e5,
	queryKey: ['getOptionContractAdditionalInfoQuery', 'IOTM'],
	queryFn: async ({ signal, queryKey }) => {
		const [, type] = queryKey;

		const response = await axios.get<ServerResponse<Dashboard.GetOptionContractAdditionalInfo.All>>(
			routes.dashboard.GetOptionContractAdditionalInfo,
			{
				params: { type },
				signal,
			},
		);
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useGetOptionMarketComparisonQuery = createQuery<
	Dashboard.GetOptionMarketComparison.TChartData,
	['getOptionMarketComparisonQuery', Dashboard.TInterval, Dashboard.GetOptionMarketComparison.TChartType]
>({
	staleTime: 6e5,
	queryKey: ['getOptionMarketComparisonQuery', 'Today', 'OptionToMarket'],
	queryFn: async ({ signal, queryKey }) => {
		const [, chartIntervalType, chartType] = queryKey;

		const response = await axios.get<ServerResponse<Dashboard.GetOptionMarketComparison.TChartData>>(
			routes.dashboard.GetOptionMarketComparison,
			{
				params: { chartIntervalType, chartType },
				signal,
			},
		);
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useGetMarketProcessChartQuery = createQuery<
	Dashboard.GetMarketProcessChart.TChartData,
	['getMarketProcessChartQuery', Dashboard.TInterval, Dashboard.GetMarketProcessChart.TChartType]
>({
	staleTime: 6e5,
	queryKey: ['getMarketProcessChartQuery', 'Today', 'Volume'],
	queryFn: async ({ signal, queryKey }) => {
		const [, chartIntervalType, chartType] = queryKey;

		const response = await axios.get<ServerResponse<Dashboard.GetMarketProcessChart.TChartData>>(
			routes.dashboard.GetMarketProcessChart,
			{
				params: { chartIntervalType, chartType },
				signal,
			},
		);
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useGetOptionTradeProcessQuery = createQuery<
	Dashboard.GetOptionTradeProcess.IChartData[],
	['getOptionTradeProcessQuery', Dashboard.TInterval]
>({
	staleTime: 6e5,
	queryKey: ['getOptionTradeProcessQuery', 'Today'],
	queryFn: async ({ signal, queryKey }) => {
		const [, chartIntervalType] = queryKey;

		const response = await axios.get<ServerResponse<Dashboard.GetOptionTradeProcess.IChartData[]>>(
			routes.dashboard.GetOptionTradeProcess,
			{
				params: { chartIntervalType },
				signal,
			},
		);
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useGetOptionWatchlistPriceChangeInfoQuery = createQuery<
	Dashboard.GetOptionWatchlistPriceChangeInfo.IChartData[],
	['getOptionWatchlistPriceChangeInfoQuery']
>({
	staleTime: 6e5,
	queryKey: ['getOptionWatchlistPriceChangeInfoQuery'],
	queryFn: async ({ signal, queryKey }) => {
		const response = await axios.get<ServerResponse<Dashboard.GetOptionWatchlistPriceChangeInfo.IChartData[]>>(
			routes.dashboard.GetOptionWatchlistPriceChangeInfo,
			{
				signal,
			},
		);
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useGetOpenPositionProcessQuery = createQuery<
	Dashboard.GetOpenPositionProcess.TChartData,
	['getOpenPositionProcessQuery', Dashboard.TInterval]
>({
	staleTime: 6e5,
	queryKey: ['getOpenPositionProcessQuery', 'Today'],
	queryFn: async ({ signal, queryKey }) => {
		const [, chartIntervalType] = queryKey;

		const response = await axios.get<ServerResponse<Dashboard.GetOpenPositionProcess.TChartData>>(
			routes.dashboard.GetOpenPositionProcess,
			{
				params: { chartIntervalType },
				signal,
			},
		);
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});
