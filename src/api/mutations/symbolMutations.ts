import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { createMutation } from '@/utils/helpers';
import axios from '../axios';
import { store } from '../inject-store';
import routes from '../routes';

export const useSymbolInfoMutation = createMutation<Symbol.Info, { symbolISIN: string; type?: string }>({
	mutationFn: async ({ symbolISIN }) => {
		const response = await axios.get<ServerResponse<Symbol.Info>>(routes.symbol.SymbolInfo, {
			params: { symbolISIN },
		});
		const { data } = response;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useFreezeSymbolMutation = createMutation<
	boolean,
	{ symbolISIN: string | string[]; type?: 'freeze' | 'unFreeze' }
>({
	mutationFn: async ({ symbolISIN, type = 'freeze' }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return false;

		const response = await axios.get<ServerResponse<Symbol.Info>>(url.FreezeRequest, {
			params: { symbolISIN: typeof symbolISIN === 'string' ? [symbolISIN] : symbolISIN, type },
		});
		const { data } = response;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return true;
	},
});
