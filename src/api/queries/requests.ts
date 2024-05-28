import { store } from '@/api/inject-store';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { createBrokerQuery } from '@/utils/helpers';
import brokerAxios from '../brokerAxios';

export const useDepositHistoryQuery = createBrokerQuery<Payment.IDepositHistoryList[] | null, ['depositHistoryOnline']>(
	{
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
	},
);

export const useListBrokerBankAccountQuery = createBrokerQuery<Payment.IBrokerAccount[] | null, ['brokerAccount']>({
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

export const useListUserBankAccountQuery = createBrokerQuery<Payment.IUserBankAccount[] | null, ['userAccount']>({
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

export const useRemainsWithDateQuery = createBrokerQuery<Payment.TRemainsWithDay | null, ['remainsWithDay']>({
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

export const useDrawalHistoryQuery = createBrokerQuery<Payment.IDrawalHistoryList[] | null, ['drawalHistoryOnline']>({
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

export const useHistoryChangeBrokerQuery = createBrokerQuery<
	Payment.IChangeBrokerList[] | null,
	['LastHistoryChangeBroker']
>({
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
});

export const useRecentFreezeQuery = createBrokerQuery<Payment.IRecentFreezeList[] | null, ['RecentFreezeList']>({
	queryKey: ['RecentFreezeList'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return null;
		const response = await brokerAxios.get<Payment.IRecentFreezeList[]>(url.RecentFreeze, {
			signal,
		});
		const data = response.data;

		if (response.status !== 200) throw new Error();

		return data;
	},
});

export const useRecentUnFreezeQuery = createBrokerQuery<Payment.IRecentFreezeList[] | null, ['RecentUnFreezeList']>({
	queryKey: ['RecentUnFreezeList'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return null;
		const response = await brokerAxios.get<Payment.IRecentFreezeList[]>(url.RecentUnFreeze, {
			signal,
		});
		const data = response.data;

		if (response.status !== 200) throw new Error();

		return data;
	},
});

export const useCountFreezeQuery = createBrokerQuery<Payment.ICountFreeze[] | null, ['CountFreezeList']>({
	queryKey: ['CountFreezeList'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return null;
		const response = await brokerAxios.get<Payment.ICountFreeze[]>(url.symbolCountFreeze, {
			signal,
		});
		const data = response.data;

		if (response.status !== 200) throw new Error();

		return data;
	},
});
