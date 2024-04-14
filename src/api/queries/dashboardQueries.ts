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
	['getIndexQuery', Dashboard.TInterval, Dashboard.TIndex]
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
	Dashboard.GetOptionMarketComparison.Data,
	['getOptionMarketComparisonQuery', Dashboard.TInterval, Dashboard.GetOptionMarketComparison.TChartType]
>({
	staleTime: 6e5,
	queryKey: ['getOptionMarketComparisonQuery', 'Today', 'OptionToMarket'],
	queryFn: async ({ signal, queryKey }) => {
		const [, chartIntervalType, chartType] = queryKey;

		const response = await axios.get<ServerResponse<Dashboard.GetOptionMarketComparison.Data>>(
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
	Dashboard.GetMarketProcessChart.Data,
	['getMarketProcessChartQuery', Dashboard.TInterval, Dashboard.GetMarketProcessChart.TChartType]
>({
	staleTime: 6e5,
	queryKey: ['getMarketProcessChartQuery', 'Today', 'Volume'],
	queryFn: async ({ signal, queryKey }) => {
		const [, chartIntervalType, chartType] = queryKey;

		const response = await axios.get<ServerResponse<Dashboard.GetMarketProcessChart.Data>>(
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
	Dashboard.GetOptionTradeProcess.Data[],
	['getOptionTradeProcessQuery', Dashboard.TInterval]
>({
	staleTime: 6e5,
	queryKey: ['getOptionTradeProcessQuery', 'Today'],
	queryFn: async ({ signal, queryKey }) => {
		const [, chartIntervalType] = queryKey;

		const response = await axios.get<ServerResponse<Dashboard.GetOptionTradeProcess.Data[]>>(
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
	Dashboard.GetOptionWatchlistPriceChangeInfo.Data[],
	['getOptionWatchlistPriceChangeInfoQuery']
>({
	staleTime: 6e5,
	queryKey: ['getOptionWatchlistPriceChangeInfoQuery'],
	queryFn: async ({ signal, queryKey }) => {
		const response = await axios.get<ServerResponse<Dashboard.GetOptionWatchlistPriceChangeInfo.Data[]>>(
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
	Dashboard.GetOpenPositionProcess.Data,
	['getOpenPositionProcessQuery', Dashboard.TInterval]
>({
	staleTime: 6e5,
	queryKey: ['getOpenPositionProcessQuery', 'Today'],
	queryFn: async ({ signal, queryKey }) => {
		const [, chartIntervalType] = queryKey;

		const response = await axios.get<ServerResponse<Dashboard.GetOpenPositionProcess.Data>>(
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

export const useGetAnnualReportQuery = createQuery<
	Dashboard.GetAnnualReport.Data[],
	['getAnnualReportQuery', Dashboard.GetAnnualReport.Type]
>({
	staleTime: 6e5,
	queryKey: ['getAnnualReportQuery', 'FundIncrease'],
	queryFn: async ({ signal, queryKey }) => {
		const [, type] = queryKey;

		const response = await axios.get<ServerResponse<Dashboard.GetAnnualReport.Data[]>>(
			routes.dashboard.GetAnnualReport,
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

export const useGetMostTradedOptionSymbolQuery = createQuery<
	Dashboard.GetMostTradedOptionSymbol.Data[],
	['getMostTradedOptionSymbolQuery']
>({
	staleTime: 6e5,
	queryKey: ['getMostTradedOptionSymbolQuery'],
	queryFn: async ({ signal }) => {
		const response = await axios.get<ServerResponse<Dashboard.GetMostTradedOptionSymbol.Data[]>>(
			routes.dashboard.GetMostTradedOptionSymbol,
			{
				signal,
			},
		);
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useGetFirstTradedOptionSymbolQuery = createQuery<
	Dashboard.GetMostTradedOptionSymbol.Data[],
	['getFirstTradedOptionSymbolQuery']
>({
	staleTime: 6e5,
	queryKey: ['getFirstTradedOptionSymbolQuery'],
	queryFn: async ({ signal }) => {
		const response = await axios.get<ServerResponse<Dashboard.GetMostTradedOptionSymbol.Data[]>>(
			routes.dashboard.GetFirstTradedOptionSymbol,
			{
				signal,
			},
		);
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useGetTopOptionBaseSymbolValueQuery = createQuery<
	Dashboard.GetTopOptionBaseSymbolValue.Data,
	['getTopOptionBaseSymbolValueQuery']
>({
	staleTime: 6e5,
	queryKey: ['getTopOptionBaseSymbolValueQuery'],
	queryFn: async ({ signal }) => {
		const response = await axios.get<ServerResponse<Dashboard.GetTopOptionBaseSymbolValue.Data>>(
			routes.dashboard.GetTopOptionBaseSymbolValue,
			{
				signal,
			},
		);
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useGetOptionSettlementInfoQuery = createQuery<
	Dashboard.GetOptionSettlementInfo.Data[],
	['getOptionSettlementInfoQuery', Dashboard.GetOptionSettlementInfo.Type]
>({
	staleTime: 6e5,
	queryKey: ['getOptionSettlementInfoQuery', 'MostRecent'],
	queryFn: async ({ signal, queryKey }) => {
		const [, type] = queryKey;

		const response = await axios.get<ServerResponse<Dashboard.GetOptionSettlementInfo.Data[]>>(
			routes.dashboard.GetOptionSettlementInfo,
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
