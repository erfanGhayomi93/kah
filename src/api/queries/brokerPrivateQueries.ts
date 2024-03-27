import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { store } from '@/features/store';
import { createQuery } from '@/utils/helpers';
import axios from '../brokerAxios';

export const useUserInfoQuery = createQuery<Broker.User | null, ['userInfoQuery']>({
	staleTime: 18e5,
	queryKey: ['userInfoQuery'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store().getState());
		if (!url) return null;

		const response = await axios.get<ServerResponse<Broker.User>>(url.userInformation, { signal });
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useUserRemainQuery = createQuery<Broker.Remain | null, ['userRemainQuery']>({
	staleTime: 18e5,
	queryKey: ['userRemainQuery'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store().getState());
		if (!url) return null;

		const response = await axios.get<ServerResponse<Broker.Remain>>(url.userRemain, { signal });
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useUserStatusQuery = createQuery<Broker.Status | null, ['userStatusQuery']>({
	staleTime: 18e5,
	queryKey: ['userStatusQuery'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store().getState());
		if (!url) return null;

		const response = await axios.get<ServerResponse<Broker.Status>>(url.userStatus, { signal });
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useBrokerOrdersCountQuery = createQuery<Broker.OrdersCount | null, ['brokerOrdersCountQuery']>({
	staleTime: 18e5,
	queryKey: ['brokerOrdersCountQuery'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store().getState());
		if (!url) return null;

		const response = await axios.get<ServerResponse<Broker.OrdersCount>>(url.ordersCount, { signal });
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useOpenOrdersQuery = createQuery<Order.OpenOrder[] | null, ['openOrdersQuery']>({
	staleTime: 6e4,
	queryKey: ['openOrdersQuery'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store().getState());
		if (!url) return null;

		const response = await axios.get<ServerResponse<Order.OpenOrder[]>>(url.openOrders, { signal });
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useTodayOrdersQuery = createQuery<Order.TodayOrder[] | null, ['openOrdersQuery']>({
	staleTime: 6e4,
	queryKey: ['openOrdersQuery'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store().getState());
		if (!url) return null;

		const response = await axios.get<ServerResponse<Order.TodayOrder[]>>(url.todayOrders, { signal });
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useExecutedOrdersQuery = createQuery<Order.ExecutedOrder[] | null, ['executedOrdersQuery']>({
	staleTime: 6e4,
	queryKey: ['executedOrdersQuery'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store().getState());
		if (!url) return null;

		const response = await axios.get<ServerResponse<Order.ExecutedOrder[]>>(url.executedOrders, { signal });
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useDraftOrdersQuery = createQuery<Order.DraftOrder[] | null, ['draftOrdersQuery']>({
	staleTime: 6e4,
	queryKey: ['draftOrdersQuery'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store().getState());
		if (!url) return null;

		const response = await axios.get<ServerResponse<Order.DraftOrder[]>>(url.drafts, { signal });
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useOptionOrdersQuery = createQuery<Order.OptionOrder[] | null, ['optionOrdersQuery']>({
	staleTime: 6e4,
	queryKey: ['optionOrdersQuery'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store().getState());
		if (!url) return null;

		const response = await axios.get<ServerResponse<Order.OptionOrder[]>>(url.optionOrders, { signal });
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useCommissionsQuery = createQuery<Broker.Commission[] | null, ['commissionsQuery']>({
	staleTime: 18e5,
	queryKey: ['commissionsQuery'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store().getState());
		if (!url) return null;

		const response = await axios.get<ServerResponse<Broker.Commission[]>>(url.commission, { signal });
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});
