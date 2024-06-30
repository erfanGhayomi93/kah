import { store } from '@/api/inject-store';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { createBrokerQuery } from '@/utils/helpers';
import axios from '../brokerAxios';

export const useUserInfoQuery = createBrokerQuery<Broker.User | null, ['userInfoQuery']>({
	staleTime: 18e5,
	queryKey: ['userInfoQuery'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return null;

		const response = await axios.get<ServerResponse<Broker.User>>(url.userInformation, { signal });
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useUserRemainQuery = createBrokerQuery<Broker.Remain | null, ['userRemainQuery']>({
	staleTime: 18e5,
	queryKey: ['userRemainQuery'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return null;

		const response = await axios.get<ServerResponse<Broker.Remain>>(url.userRemain, { signal });
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useUserStatusQuery = createBrokerQuery<Broker.Status | null, ['userStatusQuery']>({
	staleTime: 18e5,
	queryKey: ['userStatusQuery'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return null;

		const response = await axios.get<ServerResponse<Broker.Status>>(url.userStatus, { signal });
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useBrokerOrdersCountQuery = createBrokerQuery<Broker.OrdersCount, ['brokerOrdersCountQuery']>({
	staleTime: 0,
	queryKey: ['brokerOrdersCountQuery'],
	queryFn: async ({ signal }) => {
		try {
			const url = getBrokerURLs(store.getState());
			if (!url) throw new Error();

			const response = await axios.get<ServerResponse<Broker.OrdersCount>>(url.ordersCount, { signal });
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			return data.result;
		} catch (e) {
			return {
				executedOrderCnt: 0,
				openOrderCnt: 0,
				orderDraftCnt: 0,
				orderOptionCount: 0,
				todayOrderCnt: 0,
			};
		}
	},
});

export const useOpenOrdersQuery = createBrokerQuery<Order.OpenOrder[] | null, ['openOrdersQuery']>({
	staleTime: 6e4,
	queryKey: ['openOrdersQuery'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return null;

		const response = await axios.get<ServerResponse<Order.OpenOrder[]>>(url.openOrders, { signal });
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useTodayOrdersQuery = createBrokerQuery<Order.TodayOrder[] | null, ['openOrdersQuery']>({
	staleTime: 6e4,
	queryKey: ['openOrdersQuery'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return null;

		const response = await axios.get<ServerResponse<Order.TodayOrder[]>>(url.todayOrders, { signal });
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useExecutedOrdersQuery = createBrokerQuery<Order.ExecutedOrder[] | null, ['executedOrdersQuery']>({
	staleTime: 6e4,
	queryKey: ['executedOrdersQuery'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return null;

		const response = await axios.get<ServerResponse<Order.ExecutedOrder[]>>(url.executedOrders, { signal });
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useDraftOrdersQuery = createBrokerQuery<Order.DraftOrder[] | null, ['draftOrdersQuery']>({
	staleTime: 6e4,
	queryKey: ['draftOrdersQuery'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return null;

		const response = await axios.get<ServerResponse<Order.DraftOrder[]>>(url.drafts, { signal });
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useOptionOrdersQuery = createBrokerQuery<Order.OptionOrder[] | null, ['optionOrdersQuery']>({
	staleTime: 6e4,
	queryKey: ['optionOrdersQuery'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return null;

		const response = await axios.get<ServerResponse<Order.OptionOrder[]>>(url.optionOrders, { signal });
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useGetCustomerSettings = createBrokerQuery<
	Settings.IFormattedBrokerCustomerSettings | null,
	['GetCustomerSettings']
>({
	staleTime: 6e4,
	queryKey: ['GetCustomerSettings'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());

		if (!url) return null;
		const response = await axios.get<ServerResponse<Settings.IBrokerCustomerSettings[]>>(url.GetCustomerSettings, {
			signal,
		});
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');
		const formattedData: Partial<Settings.IFormattedBrokerCustomerSettings> = {};

		data?.result.forEach(({ configKey, configValue }) => {
			if (configValue === 'true') formattedData[configKey] = true;
			if (configValue === 'false') formattedData[configKey] = false;
			if (!isNaN(Number(configValue))) formattedData[configKey] = String(configValue);
		});

		return formattedData as Settings.IFormattedBrokerCustomerSettings;
	},
});

export const useGetAgreements = createBrokerQuery<Settings.IAgreements[] | null, ['getAgreements']>({
	staleTime: 6e4,
	queryKey: ['getAgreements'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return null;

		const response = await axios.get<ServerResponse<Settings.IAgreements[]>>(url.GetAgreements, { signal });
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});
