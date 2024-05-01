import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { store } from '@/features/store';
import { createQuery } from '@/utils/helpers';
import brokerAxios from '../brokerAxios';

export const usePaymentCreateQuery = createQuery<Payment.IDepositHistoryList[] | null, ['depositHistoryOnline']>({
	queryKey: ['depositHistoryOnline'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return null;

		const response = await brokerAxios.get<ServerResponse<Payment.IDepositHistoryList[]>>(
			'https://backoffice-stage.ramandtech.com/EPaymentApi/v1/History',
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
