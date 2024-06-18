import { createQuery } from '@/utils/helpers';
import { type QueryFunction } from '@tanstack/react-query';
import axios from '../axios';
import routes from '../routes';

export const symbolInfoQueryFn: QueryFunction<Symbol.Info | null, ['symbolInfoQuery', string | null], never> = async ({
	queryKey,
}) => {
	try {
		const [, symbolIsin] = queryKey;
		if (!symbolIsin) return null;

		const response = await axios.get<ServerResponse<Symbol.Info>>(routes.symbol.SymbolInfo, {
			params: { symbolIsin },
		});
		const { data } = response;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	} catch (e) {
		return null;
	}
};

export const useSymbolInfoQuery = createQuery<Symbol.Info | null, ['symbolInfoQuery', string | null]>({
	staleTime: 3e4,
	queryKey: ['symbolInfoQuery', ''],
	queryFn: symbolInfoQueryFn,
});

export const useSymbolSearchQuery = createQuery<Symbol.Search[], ['symbolSearchQuery', null | string]>({
	staleTime: 18e5,
	queryKey: ['symbolSearchQuery', null],
	queryFn: async ({ queryKey, signal }) => {
		try {
			const [, term] = queryKey;

			if (term === null) return [];

			const response = await axios.get<ServerResponse<Symbol.Search[]>>(routes.symbol.Search, {
				params: { term },
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

export const useSymbolBestLimitQuery = createQuery<Symbol.BestLimit[], ['symbolBestLimitQuery', string]>({
	staleTime: 18e5,
	queryKey: ['symbolBestLimitQuery', ''],
	queryFn: async ({ queryKey, signal }) => {
		const [, symbolIsin] = queryKey;

		const response = await axios.get<ServerResponse<Symbol.BestLimit[]>>(routes.symbol.BestLimit, {
			params: { symbolIsin },
			signal,
		});
		const { data } = response;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useSameSectorSymbolsQuery = createQuery<Symbol.SameSector[], ['sameSectorSymbolsQuery', string]>({
	staleTime: 18e5,
	queryKey: ['sameSectorSymbolsQuery', ''],
	queryFn: async ({ queryKey, signal }) => {
		const [, symbolIsin] = queryKey;

		const response = await axios.get<ServerResponse<Symbol.SameSector[]>>(
			routes.symbol.GetSameSectorSymbolsBySymbolISIN,
			{
				params: { symbolIsin },
				signal,
			},
		);
		const { data } = response;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useSupervisorMessagesQuery = createQuery<Message.Supervisor[], ['supervisorMessagesQuery', string]>({
	staleTime: 18e5,
	queryKey: ['supervisorMessagesQuery', ''],
	queryFn: async ({ queryKey, signal }) => {
		const [, symbolIsin] = queryKey;

		const response = await axios.get<ServerResponse<Message.Supervisor[]>>(routes.symbol.GetSupervisedMessage, {
			params: { symbolIsin, pageSize: 25, pageNumber: 1 },
			signal,
		});
		const { data } = response;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useSymbolChartDataQuery = createQuery<
	Symbol.ChartData[],
	['symbolChartDataQuery', string, 'Today' | 'Weekly' | 'Monthly' | 'Yearly']
>({
	staleTime: 0,
	queryKey: ['symbolChartDataQuery', '', 'Today'],
	queryFn: async ({ queryKey, signal }) => {
		const [, SymbolISIN, Duration] = queryKey;

		const response = await axios.get<ServerResponse<Symbol.ChartData[]>>(routes.symbol.ChartData, {
			params: { SymbolISIN, Duration },
			signal,
		});
		const { data } = response;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});
