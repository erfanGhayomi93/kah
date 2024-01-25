import { createQuery } from '@/utils/helpers';
import axios from '../axios';
import routes from '../routes';

interface IOptionWatchlistQuery {
	SymbolISINs: string[];
	FromContractEndDate: string;
	ToContractEndDate: string;
	MinimumTradeValue: string;
	FromContractSize: string;
	ToContractSize: string;
	FromDelta: string;
	ToDelta: string;
	OptionType: Array<'Call' | 'Put'>;
	IOTM: Array<'ATM' | 'OTM' | 'ITM'>;
}

export const useOptionWatchlistQuery = createQuery<
	Option.Root[],
	['optionWatchlistQuery', Partial<IOptionWatchlistFilters>]
>({
	queryKey: ['optionWatchlistQuery', {}],
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

			if (props.endDate) {
				if (props.endDate[0]) params.FromContractEndDate = new Date(props.endDate[0]).toISOString();
				if (props.endDate[1]) params.ToContractEndDate = new Date(props.endDate[1]).toISOString();
			}

			if (props.contractSize) {
				const fromContractSize = props.contractSize[0];
				const toContractSize = props.contractSize[1];

				if (fromContractSize && Number(fromContractSize) > 0) params.FromContractSize = props.contractSize[0];
				if (toContractSize && Number(toContractSize) > 0) params.ToContractSize = props.contractSize[1];
			}

			if (props.delta) {
				const fromDelta = props.delta[0];
				const toDelta = props.delta[1];

				if (fromDelta && Number(fromDelta) > -1) params.FromDelta = fromDelta;
				if (toDelta && Number(toDelta) < 1) params.ToDelta = toDelta;
			}

			const response = await axios.get<ServerResponse<Option.Root[]>>(routes.optionWatchlist.Watchlist, {
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

export const useOptionSymbolColumnsQuery = createQuery<Option.Root[], ['optionSymbolColumnsQuery']>({
	staleTime: 36e5,
	queryKey: ['optionSymbolColumnsQuery'],
	queryFn: async ({ signal }) => {
		try {
			const response = await axios.get<ServerResponse<Option.Root[]>>(
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

export const useOptionSymbolSearchQuery = createQuery<Option.SymbolSearch[], ['optionSymbolSearchQuery', string]>({
	staleTime: 18e5,
	queryKey: ['optionSymbolSearchQuery', ''],
	queryFn: async ({ queryKey, signal }) => {
		try {
			const [, term] = queryKey;

			const params: Record<string, string> = {};
			if (term) params.term = term;

			const response = await axios.get<ServerResponse<Option.SymbolSearch[]>>(routes.option.OptionSymbolSearch, {
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
