import { createQuery } from '@/utils/helpers';
import axios from '../axios';
import routes from '../routes';

interface TPaginationInputs {
	pageNumber: number;
	pageSize: number;
}

export interface IOptionWatchlistQuery {
	SymbolISINs: string[];
	Id: string;
	FromDueDays: string;
	ToDueDays: string;
	MinimumTradeValue: string;
	FromDelta: string;
	ToDelta: string;
	OptionType: Array<'Call' | 'Put'>;
	IOTM: Array<'ATM' | 'OTM' | 'ITM'>;
}

export const useOptionWatchlistQuery = createQuery<
	Option.Root[],
	['optionWatchlistQuery', Partial<IOptionWatchlistFilters> & TPaginationInputs & { watchlistId: number }]
>({
	queryKey: ['optionWatchlistQuery', { watchlistId: -1, pageNumber: 1, pageSize: 25 }],
	queryFn: async ({ queryKey, signal }) => {
		const [, props] = queryKey;
		try {
			const params: Partial<IOptionWatchlistQuery> = {};

			if (props.minimumTradesValue && Number(props.minimumTradesValue) >= 0)
				params.MinimumTradeValue = props.minimumTradesValue;

			if (Array.isArray(props.symbols) && props.symbols.length > 0)
				params.SymbolISINs = props.symbols.map((item) => item.symbolISIN);

			if (Array.isArray(props.type) && props.type.length > 0) params.OptionType = props.type;

			if (Array.isArray(props.status) && props.status.length > 0) params.IOTM = props.status;

			if (props.dueDays && props.dueDays[1] >= props.dueDays[0]) {
				if (props.dueDays[0] > 0) params.FromDueDays = String(props.dueDays[0]);
				if (props.dueDays[1] < 365) params.ToDueDays = String(props.dueDays[1]);
			}

			if (props.delta && props.delta[1] >= props.delta[0]) {
				if (props.delta[0] > -1) params.FromDelta = String(props.delta[0]);
				if (props.delta[1] < 1) params.ToDelta = String(props.delta[1]);
			}

			if (props.watchlistId > -1) params.Id = String(props.watchlistId);

			const response = await axios.get<PaginationResponse<Option.Root[]>>(
				props.watchlistId > -1 ? routes.optionWatchlist.GetCustomWatchlist : routes.optionWatchlist.Watchlist,
				{
					params,
					signal,
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

export const useOptionSymbolColumnsQuery = createQuery<Option.Column[], ['optionSymbolColumnsQuery']>({
	staleTime: 36e5,
	queryKey: ['optionSymbolColumnsQuery'],
	queryFn: async ({ signal }) => {
		try {
			const response = await axios.get<ServerResponse<Option.Column[]>>(
				routes.optionWatchlist.OptionSymbolColumns,
				{ signal },
			);
			const { data } = response;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			return data.result;
		} catch (e) {
			return [];
		}
	},
});

export const useDefaultOptionSymbolColumnsQuery = createQuery<Option.Column[], ['defaultOptionSymbolColumnsQuery']>({
	staleTime: 36e5,
	queryKey: ['defaultOptionSymbolColumnsQuery'],
	queryFn: async ({ signal }) => {
		try {
			const response = await axios.get<ServerResponse<Option.Column[]>>(
				routes.optionWatchlist.DefaultOptionSymbolColumns,
				{ signal },
			);
			const { data } = response;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			return data.result;
		} catch (e) {
			return [];
		}
	},
});

export const useOptionSymbolSearchQuery = createQuery<
	Option.CustomWatchlistSearch[],
	['optionSymbolSearchQuery', { term: string; id: number }]
>({
	staleTime: 18e5,
	queryKey: ['optionSymbolSearchQuery', { term: '', id: -1 }],
	queryFn: async ({ queryKey, signal }) => {
		try {
			const [, { term, id }] = queryKey;

			if (term.length < 2 || id === -1) return [];

			const response = await axios.get<ServerResponse<Option.CustomWatchlistSearch[]>>(
				routes.optionWatchlist.CustomWatchlistOptionSearch,
				{
					params: {
						term,
						Id: id,
					},
					signal,
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

export const useBaseSettlementDaysQuery = createQuery<
	Option.BaseSettlementDays[],
	['baseSettlementDaysQuery', null | string]
>({
	staleTime: 18e5,
	queryKey: ['baseSettlementDaysQuery', null],
	queryFn: async ({ queryKey, signal }) => {
		try {
			const [, baseSymbolIsin] = queryKey;

			const params: Record<string, string> = {};
			if (baseSymbolIsin) params.baseSymbolIsin = baseSymbolIsin;
			else return [];

			const response = await axios.get<ServerResponse<Option.BaseSettlementDays[]>>(
				routes.option.BaseSettlementDays,
				{
					params,
					signal,
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

export const useWatchlistBySettlementDateQuery = createQuery<
	Option.Root[],
	['watchlistBySettlementDateQuery', null | Record<'settlementDate' | 'baseSymbolISIN', string>]
>({
	staleTime: 18e5,
	queryKey: ['watchlistBySettlementDateQuery', null],
	queryFn: async ({ queryKey, signal }) => {
		try {
			const [, params] = queryKey;

			const response = await axios.get<ServerResponse<Option.Root[]>>(
				routes.optionWatchlist.WatchlistBySettlementDate,
				{
					params,
					signal,
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

export const useOptionCalculativeInfoQuery = createQuery<
	Option.CalculativeInfo,
	['optionCalculativeInfoQuery', string]
>({
	staleTime: 18e5,
	queryKey: ['optionCalculativeInfoQuery', ''],
	queryFn: async ({ queryKey, signal }) => {
		const [, symbolISIN] = queryKey;

		const response = await axios.get<ServerResponse<Option.CalculativeInfo>>(
			routes.optionWatchlist.OptionCalculativeInfo,
			{
				params: { symbolISIN },
				signal,
			},
		);
		const { data } = response;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useGetAllCustomWatchlistQuery = createQuery<Option.WatchlistList[], ['getAllCustomWatchlistQuery']>({
	staleTime: 36e5,
	queryKey: ['getAllCustomWatchlistQuery'],
	queryFn: async ({ signal }) => {
		try {
			const response = await axios.get<ServerResponse<Option.WatchlistList[]>>(
				routes.optionWatchlist.GetAllCustomWatchlist,
				{ signal },
			);
			const { data } = response;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			return data.result;
		} catch (e) {
			return [];
		}
	},
});

export const useOptionBaseSymbolSearchQuery = createQuery<
	Option.Search[],
	[
		'optionBaseSymbolSearchQuery',
		Partial<{ term: null | string; orderBy: 'MaximumValue' | 'ClosestSettlement' | 'Alphabet' }>,
	]
>({
	staleTime: 18e5,
	queryKey: ['OptionBaseSymbolSearchQuery', {}],
	queryFn: async ({ queryKey, signal }) => {
		try {
			const [, { term, orderBy }] = queryKey;

			if (term === null) return [];

			const params: Record<string, string> = {};
			if (term) params.term = term;
			if (orderBy) params.orderBy = orderBy;

			const response = await axios.get<ServerResponse<Option.Search[]>>(routes.option.OptionBaseSymbolSearch, {
				params,
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
