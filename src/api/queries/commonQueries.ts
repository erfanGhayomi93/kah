import { createQuery } from '@/utils/helpers';
import axios from '../axios';
import routes from '../routes';

export const useTimeQuery = createQuery<Common.Time, ['useTimeQuery']>({
	staleTime: 36e5,
	queryKey: ['useTimeQuery'],
	queryFn: async ({ signal }) => {
		try {
			const response = await axios.get<ServerResponse<Common.Time>>(routes.common.time, { signal });
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			return data.result;
		} catch (e) {
			return new Date().toISOString();
		}
	},
});

export const useCommissionsQuery = createQuery<Commission.Data, ['commissionQuery']>({
	staleTime: 36e5,
	queryKey: ['commissionQuery'],
	queryFn: async ({ signal }) => {
		const commission: Commission.Data = {};

		try {
			const response = await axios.get<ServerResponse<Commission.Root[]>>(routes.common.GetBuyAndSellCommission, {
				signal,
			});
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			data.result.forEach((item) => {
				try {
					commission[item.marketUnitTitle] = item;
				} catch (e) {
					//
				}
			});
		} catch (e) {
			//
		}

		return commission;
	},
});
