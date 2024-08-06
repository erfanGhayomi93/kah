import { createMutation } from '@/utils/helpers';
import axios from '../axios';
import routes from '../routes';

export const useToggleCustomWatchlistSymbolMutation = createMutation<
	boolean,
	{ symbolISIN: string; watchlistId: number; watchlist?: Option.WatchlistList; action: 'add' | 'remove' }
>({
	mutationFn: async ({ watchlistId, symbolISIN, action }) => {
		try {
			await axios.post<ServerResponse<string>>(
				routes.optionWatchlist[action === 'add' ? 'AddSymbolCustomWatchlist' : 'RemoveSymbolCustomWatchlist'],
				{
					id: watchlistId,
					[action === 'add' ? 'symbolISINs' : 'symbolISIN']: action === 'add' ? [symbolISIN] : symbolISIN,
				},
			);

			return true;
		} catch (e) {
			return false;
		}
	},
});

export const useResetOptionWatchlistMutation = createMutation({
	mutationFn: async () => {
		const response = await axios.post(routes.optionWatchlist.ResetOptionSymbolColumns);
		const { data } = response;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useUpdateOptionWatchlistColumnsMutation = createMutation<
	ServerResponse<boolean>,
	{ id: number[]; isHidden: boolean }
>({
	mutationFn: async ({ id, isHidden }) => {
		const response = await axios.post(routes.optionWatchlist.UpdateOptionSymbolColumns, {
			id,
			isHidden,
		});
		const { data } = response;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useDeleteCustomWatchlistSymbolMutation = createMutation<
	boolean,
	{ watchlistId: number; symbolISIN: string; symbolTitle: string }
>({
	mutationFn: async ({ watchlistId, symbolISIN }) => {
		const response = await axios.post<ServerResponse<boolean>>(routes.optionWatchlist.RemoveSymbolCustomWatchlist, {
			id: watchlistId,
			symbolISIN,
		});
		const { data } = response;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useDeleteCustomWatchlistMutation = createMutation<boolean, number[]>({
	mutationFn: async (watchlistsId) => {
		const response = await axios.post<ServerResponse<boolean>>(routes.optionWatchlist.DeleteCustomWatchlist, {
			ids: watchlistsId,
		});
		const { data } = response;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useUpdateCustomWatchlistNameMutation = createMutation<boolean, { watchlistId: number; name: string }>({
	mutationFn: async ({ watchlistId, name }) => {
		const response = await axios.post<ServerResponse<boolean>>(routes.optionWatchlist.UpdateCustomWatchlist, {
			id: watchlistId,
			name,
		});
		const { data } = response;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useUpdateCustomWatchlistOrderMutation = createMutation<boolean, { orders: Record<number, number> }>({
	mutationFn: async ({ orders }) => {
		const response = await axios.post<ServerResponse<boolean>>(routes.optionWatchlist.UpdateCustomWatchlistOrder, {
			orders,
		});
		const { data } = response;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useUpdateCustomWatchlistHiddenMutation = createMutation<boolean, { id: number[]; isHidden: boolean }>({
	mutationFn: async ({ id, isHidden }) => {
		const response = await axios.post<ServerResponse<boolean>>(routes.optionWatchlist.ChangeHiddenCustomWatchlist, {
			id,
			isHidden,
		});
		const { data } = response;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useCreateCustomWatchlistMutation = createMutation<boolean, string>({
	mutationFn: async (name) => {
		const response = await axios.post<ServerResponse<boolean>>(routes.optionWatchlist.CreateCustomWatchlist, {
			name: name.replace(/^\s+|\s+$/g, ''),
		});
		const { data } = response;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});
