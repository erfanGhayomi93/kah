import { createQuery } from '@/utils/helpers';
import axios from '../axios';
import routes from '../routes';

export const useGetAllStrategyQuery = createQuery<Strategy.GetAll[], ['getAllStrategyQuery']>({
	staleTime: 36e5,
	queryKey: ['getAllStrategyQuery'],
	queryFn: async ({ signal }) => {
		try {
			const response = await axios.get<ServerResponse<Strategy.GetAll[]>>(routes.strategy.GetAll, {
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
