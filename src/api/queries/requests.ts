import { store } from '@/api/inject-store';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { createBrokerQuery } from '@/utils/helpers';
import brokerAxios from '../brokerAxios';

export const useDepositHistoryQuery = createBrokerQuery<Payment.IDepositHistoryList[], ['depositHistoryOnline']>({
	queryKey: ['depositHistoryOnline'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return [];

		const response = await brokerAxios.get<ServerResponse<Payment.IDepositHistoryList[]>>(
			url.DepositOnlineHistory,
			{
				signal,
			},
		);
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useReceiptHistoryQuery = createBrokerQuery<Payment.IReceiptHistoryList[], ['receiptHistoryOnline']>({
	queryKey: ['receiptHistoryOnline'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return [];

		const response = await brokerAxios.get<ServerResponse<Payment.IReceiptHistoryList[]>>(
			url.DepositOfflineHistory,
			{
				signal,
			},
		);
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useListBrokerBankAccountQuery = createBrokerQuery<Payment.IBrokerAccount[], ['brokerAccount']>({
	queryKey: ['brokerAccount'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return [];

		const response = await brokerAxios.get<ServerResponse<Payment.IBrokerAccount[]>>(url.BankBrokerAccounts, {
			signal,
		});
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useListUserBankAccountQuery = createBrokerQuery<Payment.IUserBankAccount[], ['userAccount']>({
	queryKey: ['userAccount'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return [];

		const response = await brokerAxios.get<ServerResponse<Payment.IUserBankAccount[]>>(url.BankGet, {
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

		const response = await brokerAxios.get<ServerResponse<Payment.TRemainsWithDay>>(url.WithdrawalLimitDates, {
			signal,
		});
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useWithdrawalHistoryQuery = createBrokerQuery<
	Payment.IWithdrawalHistoryList[],
	['withdrawalHistoryOnline']
>({
	queryKey: ['withdrawalHistoryOnline'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return [];

		const response = await brokerAxios.get<ServerResponse<Payment.IWithdrawalHistoryList[]>>(
			url.AccountWithdrawalRecentHistory,
			{
				signal,
				params: { count: 20 },
			},
		);
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useHistoryChangeBrokerQuery = createBrokerQuery<Payment.IChangeBrokerList[], ['LastHistoryChangeBroker']>({
	queryKey: ['LastHistoryChangeBroker'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return [];

		const response = await brokerAxios.get<ServerResponse<Payment.IChangeBrokerList[]>>(url.ChangeBrokerGet, {
			signal,
		});
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useRecentFreezeQuery = createBrokerQuery<Payment.IRecentFreezeList[], ['RecentFreezeList']>({
	queryKey: ['RecentFreezeList'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return [];

		const response = await brokerAxios.get<Payment.IRecentFreezeList[]>(url.FreezeRecentFreezeRequest, {
			signal,
		});
		const data = response.data;

		if (response.status !== 200) throw new Error();

		return data;
	},
});

export const useRecentUnFreezeQuery = createBrokerQuery<Payment.IRecentFreezeList[], ['RecentUnFreezeList']>({
	queryKey: ['RecentUnFreezeList'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return [];

		const response = await brokerAxios.get<Payment.IRecentFreezeList[]>(url.FreezeRecentUnFreezeRequest, {
			signal,
		});
		const data = response.data;

		if (response.status !== 200) throw new Error();

		return data;
	},
});

export const useCountFreezeQuery = createBrokerQuery<Payment.ICountFreeze[], ['CountFreezeList']>({
	queryKey: ['CountFreezeList'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return [];

		const response = await brokerAxios.get<Payment.ICountFreeze[]>(url.FreezeFreezedSymbols, {
			signal,
		});
		const data = response.data;

		if (response.status !== 200) throw new Error();

		return data;
	},
});
