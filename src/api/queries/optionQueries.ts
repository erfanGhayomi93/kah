import routes from '../routes';

export const getOptionData = async (): Promise<Option.Root[]> => {
	try {
		const res = await fetch(routes.option.Watchlist);
		const repo = (await res.json()) as ServerResponse<Option.Root[]>;

		return repo.result;
	} catch (e) {
		return [];
	}
};
