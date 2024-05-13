import axios from './axios';
import routes from './routes';

export const fetchSymbolInfo = async (symbolIsin: string): Promise<Symbol.Info | null> => {
	try {
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
