import brokerAxios from '@/api/brokerAxios';
import { store } from '@/api/inject-store';
import ipcMain from '@/classes/IpcMain';
import { brokerQueryClient } from '@/components/common/Registry/QueryClientRegistry';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { getOrdersActiveTab } from '@/features/slices/tabSlice';
import { type QueryKey } from '@tanstack/react-query';
import { toISOStringWithoutChangeTime } from './helpers';

export const createOrders = (orders: IOFields[]) => ipcMain.send('send_orders', orders);

export const createOrder = (fields: IOFields) => {
	return new Promise<string | undefined>((resolve) => {
		return ipcMain
			.sendAsync<string | undefined>('send_order', fields)
			.then(resolve)
			.catch(() => resolve(undefined));
	});
};

export const createDraft = (order: IOFields) => {
	return new Promise<number>(async (resolve, reject) => {
		const urls = getBrokerURLs(store.getState());
		if (!urls) {
			reject();
			return;
		}

		try {
			const response = await brokerAxios.post<ServerResponse<number>>(urls.OrderDraftCreate, {
				price: order.price,
				quantity: order.quantity,
				side: order.orderSide,
				symbolISIN: order.symbolISIN,
				validity: order.validity,
				validityDate:
					order.validityDate <= 0 ? undefined : toISOStringWithoutChangeTime(new Date(order.validityDate)),
			});
			const { data } = response;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			refetchActiveOrderTab();
			refetchOrdersCount();
			resolve(data.result);
		} catch (e) {
			reject(e);
		}
	});
};

export const updateDraft = (order: IOFieldsWithID) => {
	return new Promise<number>(async (resolve, reject) => {
		const urls = getBrokerURLs(store.getState());
		if (!urls) {
			reject();
			return;
		}

		try {
			const response = await brokerAxios.post<ServerResponse<number>>(urls.OrderDraftUpdate, {
				id: order.id,
				price: order.price,
				quantity: order.quantity,
				side: order.orderSide,
				validity: order.validity,
				validityDate:
					order.validityDate <= 0 ? undefined : toISOStringWithoutChangeTime(new Date(order.validityDate)),
			});
			const { data } = response;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			refetchDrafts();
			resolve(data.result);
		} catch (e) {
			reject();
		}
	});
};

export const updateOrder = (order: IOFieldsWithID) => {
	return new Promise<number>(async (resolve, reject) => {
		const urls = getBrokerURLs(store.getState());
		if (!urls) {
			reject();
			return;
		}

		try {
			const response = await brokerAxios.post<ServerResponse<number>>(urls.OrderUpdate, {
				parentOrderId: order.id,
				price: order.price,
				quantity: order.quantity,
				side: order.orderSide,
				validity: order.validity,
				validityDate:
					order.validityDate <= 0 ? undefined : toISOStringWithoutChangeTime(new Date(order.validityDate)),
			});
			const { data } = response;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			refetchActiveOrderTab();
			resolve(data.result);
		} catch (e) {
			reject();
		}
	});
};

export const deleteOrder = (ids: number[]) => {
	return new Promise<boolean>(async (resolve, reject) => {
		const urls = getBrokerURLs(store.getState());
		if (!urls || ids.length === 0) {
			reject();
			return;
		}

		try {
			const isSingle = ids.length === 1;
			const url = isSingle ? urls.OrderDelete : urls.OrderGroupDelete;

			const response = await brokerAxios.post<ServerResponse<boolean>>(url, {
				orderId: isSingle ? ids[0] : ids,
			});
			const { data } = response;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			refetchActiveOrderTab();
			refetchOrdersCount();
			resolve(data.result);
		} catch (e) {
			reject();
		}
	});
};

export const deleteDraft = (ids: number[]) => {
	return new Promise<boolean>(async (resolve, reject) => {
		const urls = getBrokerURLs(store.getState());
		if (!urls || ids.length === 0) {
			reject();
			return;
		}

		try {
			const isSingle = ids.length === 1;
			const url = isSingle ? urls.OrderDraftDelete : urls.OrderDraftGroupDelete;

			const response = await brokerAxios.post<ServerResponse<boolean>>(url, {
				ordersDraftId: isSingle ? ids[0] : ids,
			});
			const { data } = response;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			refetchOrdersCount();
			refetchDrafts();
			resolve(data.result);
		} catch (e) {
			reject();
		}
	});
};

export const refetchOrdersCount = () => {
	brokerQueryClient!.refetchQueries({
		queryKey: ['brokerOrdersCountQuery'],
	});
};

export const refetchDrafts = () => {
	brokerQueryClient!.refetchQueries({
		queryKey: ['draftOrdersQuery'],
	});
};

export const refetchActiveOrderTab = () => {
	const activeTab = getOrdersActiveTab(store.getState());
	let queryKey: QueryKey | undefined;

	if (activeTab === 'open_orders') queryKey = ['openOrdersQuery'];
	else if (activeTab === 'draft') queryKey = ['draftOrdersQuery'];
	else if (activeTab === 'executed_orders') queryKey = ['executedOrdersQuery'];
	else if (activeTab === 'option_orders') queryKey = ['optionOrdersQuery'];
	else if (activeTab === 'today_orders') queryKey = ['todayOrders'];

	brokerQueryClient!.refetchQueries({ queryKey });
};
