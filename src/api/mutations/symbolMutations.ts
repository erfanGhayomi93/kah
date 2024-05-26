import { createMutation } from '@/utils/helpers';
import axios from '../axios';
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
