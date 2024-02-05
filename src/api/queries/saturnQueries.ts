import { createQuery } from '@/utils/helpers';
import axios from '../axios';
import routes from '../routes';

export const useAllSaturnQuery = createQuery<Saturn.All[], ['useAllSaturn']>({
	staleTime: 36e5,
	queryKey: ['useAllSaturn'],
	queryFn: async ({ signal }) => {
		try {
			const response = await axios.get<ServerResponse<Saturn.All[]>>(routes.saturn.GetAllSaturns, { signal });
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			return data.result;
		} catch (e) {
			return [];
		}
	},
});

export const useSingleSaturnQuery = createQuery<Saturn.Single[], ['useSingleSaturn']>({
	staleTime: 36e5,
	queryKey: ['useSingleSaturn'],
	queryFn: async ({ signal }) => {
		try {
			const response = await axios.get<ServerResponse<Saturn.Single[]>>(routes.saturn.GetSaturn, { signal });
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			return data.result;
		} catch (e) {
			return [];
		}
	},
});
