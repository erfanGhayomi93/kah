import { createQuery } from '@/utils/helpers';
import axios from '../axios';
import routes from '../routes';

interface IOptionWatchlistQuery {
	SymbolISINs: string[];
	FromContractEndDate: string;
	ToContractEndDate: string;
	MinimumTradeValue: number;
	FromContractSize: number;
	ToContractSize: number;
	FromDelta: number;
	ToDelta: number;
	OptionType: Array<'Call' | 'Put'>;
	IOTM: Array<'ATM' | 'OTM' | 'ITM'>;
}

export const useOptionWatchlistQuery = createQuery<Option.Root[], ['optionWatchlistQuery', Partial<IOptionWatchlistFilters>]>({
	queryKey: ['optionWatchlistQuery', {}],
	queryFn: async ({ queryKey }) => {
		const [, props] = queryKey;
		try {
			const params: Partial<IOptionWatchlistQuery> = {};

			if (props.minimumTradesValue && props.minimumTradesValue >= 0) params.MinimumTradeValue = props.minimumTradesValue;

			if (Array.isArray(props.symbols) && props.symbols.length > 0) params.SymbolISINs = props.symbols;

			if (Array.isArray(props.type) && props.type.length > 0) params.OptionType = props.type;

			if (Array.isArray(props.status) && props.status.length > 0) params.IOTM = props.status;

			if (props.endDate) {
				if (props.endDate[0]) params.FromContractEndDate = new Date(props.endDate[0]).toISOString();
				if (props.endDate[1]) params.ToContractEndDate = new Date(props.endDate[1]).toISOString();
			}

			if (props.contractSize) {
				if (props.contractSize[0] >= 0) params.FromContractSize = props.contractSize[0];
				if (props.contractSize[1] >= 0) params.ToContractSize = props.contractSize[1];
			}

			if (props.delta) {
				if (props.delta[0] >= 0) params.FromDelta = props.delta[0];
				if (props.delta[1] >= 0) params.ToDelta = props.delta[1];
			}

			const response = await axios.get<ServerResponse<Option.Root[]>>(routes.option.Watchlist, { params });
			const { data } = response;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			return data.result;
		} catch (e) {
			return [];
		}
	},
});
