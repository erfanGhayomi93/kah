import { createMutation } from '@/utils/helpers';
import axios from '../axios';
import routes from '../routes';

export const useOptionInfoMutation = createMutation<Option.Root[], string[]>({
	mutationFn: async (symbolISINs) => {
		const response = await axios.get<PaginationResponse<Option.Root[]>>(routes.optionWatchlist.Watchlist, {
			params: {
				'QueryOption.PageNumber': 1,
				'QueryOption.PageSize': symbolISINs.length,
				SymbolISINs: symbolISINs,
			},
		});
		const { data } = response;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useResetOptionWatchlistMutation = createMutation({
	mutationFn: async () => {
		const response = await axios.get(routes.optionWatchlist.ResetOptionSymbolColumns);
		const { data } = response;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useUpdateOptionWatchlistMutation = createMutation<
	ServerResponse<boolean>,
	{ id: number; isHidden: boolean }
>({
	mutationFn: async () => {
		const response = await axios.get(routes.optionWatchlist.UpdateOptionSymbolColumns);
		const { data } = response;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});
