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

		const response = await axios.get<ServerResponse<Broker.User>>(url.AccountInformation, { signal });
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useUserRemainQuery = createBrokerQuery<Broker.Remain | null, ['userRemainQuery']>({
	staleTime: 6e5,
	queryKey: ['userRemainQuery'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return null;

		const response = await axios.get<ServerResponse<Broker.Remain>>(url.AccountRemain, { signal });
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

		const response = await axios.get<ServerResponse<Broker.Status>>(url.OptionGetRemain, { signal });
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

			const response = await axios.get<ServerResponse<Broker.OrdersCount>>(url.OrderCount, { signal });
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

		const response = await axios.get<ServerResponse<Order.OpenOrder[]>>(url.OrderGetOpen, { signal });
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

		const response = await axios.get<ServerResponse<Order.TodayOrder[]>>(url.OrderGetToday, { signal });
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

		const response = await axios.get<ServerResponse<Order.ExecutedOrder[]>>(url.OrderGetDone, { signal });
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

		const response = await axios.get<ServerResponse<Order.DraftOrder[]>>(url.OrderDraftGet, { signal });
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

		const response = await axios.get<ServerResponse<Order.OptionOrder[]>>(url.OrderGetOption, { signal });
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useGetCustomerSettingsQuery = createBrokerQuery<
	Settings.IFormattedBrokerCustomerSettings | null,
	['GetCustomerSettings']
>({
	staleTime: 6e4,
	queryKey: ['GetCustomerSettings'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());

		if (!url) return null;
		const response = await axios.get<ServerResponse<Settings.IBrokerCustomerSettings[]>>(url.AccountSettingGet, {
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

export const useGetAgreementsQuery = createBrokerQuery<Settings.IAgreements[] | null, ['getAgreements']>({
	staleTime: 6e4,
	queryKey: ['getAgreements'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return null;

		const response = await axios.get<ServerResponse<Settings.IAgreements[]>>(url.AgreementsGet, { signal });
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useGlPortfolioQuery = createBrokerQuery<Portfolio.GlPortfolio[], ['glPortfolioQuery', TPriceBasis]>({
	staleTime: 0,
	queryKey: ['glPortfolioQuery', 'LastTradePrice'],
	queryFn: async ({ signal, queryKey }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return [];

		const [, priceType] = queryKey;

		const response = await axios.get<ServerResponse<Portfolio.GlPortfolio[]>>(url.GLPortfolio, {
			signal,
			params: { priceType },
		});
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useGlOptionOrdersQuery = createBrokerQuery<GLOptionOrder.Root | null, ['glOptionOrdersQuery']>({
	staleTime: 0,
	queryKey: ['glOptionOrdersQuery'],
	queryFn: async ({ signal }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return null;

		const response = await axios.get<ServerResponse<GLOptionOrder.Root>>(url.GLOptionOrders, { signal });
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useGlPositionExtraInfoQuery = createBrokerQuery<
	GlPositionExtraInfo | null,
	['glPositionExtraInfoQuery', string]
>({
	staleTime: 1e5,
	queryKey: ['glPositionExtraInfoQuery', ''],
	queryFn: async ({ signal, queryKey }) => {
		const url = getBrokerURLs(store.getState());
		if (!url) return null;

		const [, symbolISIN] = queryKey;

		const response = await axios.get<ServerResponse<GlPositionExtraInfo>>(url.GLPositionExtraInfo, {
			params: { symbolISIN },
			signal,
		});
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});

export const useAvailableContractInfoQuery = createBrokerQuery<
	IAvailableContractInfo[],
	['availableContractInfoQuery', string]
>({
	staleTime: 0,
	queryKey: ['availableContractInfoQuery', ''],
	queryFn: async ({ signal, queryKey }) => {
		const url = getBrokerURLs(store.getState());
		if (!url || !queryKey[1]) return [];

		const [, symbolISIN] = queryKey;

		const response = await axios.get<ServerResponse<IAvailableContractInfo[]>>(url.OrderAvailableContractInfo, {
			signal,
			params: { symbolISIN },
		});
		const data = response.data;

		if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

		return data.result;
	},
});
