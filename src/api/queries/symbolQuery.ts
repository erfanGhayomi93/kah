import { createQuery } from '@/utils/helpers';
import axios from '../axios';
import routes from '../routes';

export const useSymbolInfoQuery = createQuery<Symbol.Info | null, ['symbolInfoQuery', string | null]>({
	refetchOnWindowFocus: true,
	queryKey: ['symbolInfoQuery', ''],
	queryFn: async ({ queryKey, signal }) => {
		try {
			const [, symbolIsin] = queryKey;

			if (!symbolIsin) return null;

			const response = await axios.get<ServerResponse<Symbol.Info>>(routes.option.SymbolInfo, {
				params: { symbolIsin },
				signal,
			});
			const { data } = response;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			return data.result;
		} catch (e) {
			return null;
		}
	},
});
