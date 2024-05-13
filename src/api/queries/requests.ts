import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { store } from '@/features/store';
import { createQuery } from '@/utils/helpers';
import brokerAxios from '../brokerAxios';

export const useDepositHistoryQuery = createQuery<Payment.IDepositHistoryList[] | null, ['depositHistoryOnline']>({
	queryKey: ['depositHistoryOnline'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return null;
		const response = await brokerAxios.get<ServerResponse<Payment.IDepositHistoryList[]>>(
			url.getDepositOnlineHistory,
			{
				signal,
			},
		);
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useListBrokerBankAccountQuery = createQuery<Payment.IBrokerAccount[] | null, ['brokerAccount']>({
	queryKey: ['brokerAccount'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return null;

		const response = await brokerAxios.get<ServerResponse<Payment.IBrokerAccount[]>>(url.getListBrokerBankAccount, {
			signal,
		});
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useListUserBankAccountQuery = createQuery<Payment.IUserBankAccount[] | null, ['userAccount']>({
	queryKey: ['userAccount'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return null;

		const response = await brokerAxios.get<ServerResponse<Payment.IUserBankAccount[]>>(url.GetListBankAccount, {
			signal,
		});
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useRemainsWithDateQuery = createQuery<Payment.TRemainsWithDay | null, ['remainsWithDay']>({
	queryKey: ['remainsWithDay'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return null;

		const response = await brokerAxios.get<ServerResponse<Payment.TRemainsWithDay>>(url.GetRemainsWithDate, {
			signal,
		});
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useDrawalHistoryQuery = createQuery<Payment.IDrawalHistoryList[] | null, ['drawalHistoryOnline']>({
	queryKey: ['drawalHistoryOnline'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return null;
		const response = await brokerAxios.get<ServerResponse<Payment.IDrawalHistoryList[]>>(url.LastListDrawal, {
			signal,
			params: { count: 20 },
		});
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useHistoryChangeBrokerQuery = createQuery<Payment.IChangeBrokerList[] | null, ['LastHistoryChangeBroker']>(
	{
		queryKey: ['LastHistoryChangeBroker'],
		queryFn: async ({ signal }) => {
			const url = getBrokerURLs(store.getState());
			if (!url) return null;
			const response = await brokerAxios.get<ServerResponse<Payment.IChangeBrokerList[]>>(url.LastChangeBrokers, {
				signal,
			});
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			return data.result;
		},
	},
);
