import brokerAxios from '@/api/brokerAxios';
import ipcMain from '@/classes/IpcMain';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { store } from '@/features/store';

export const createOrder = (fields: IOFields) =>
	new Promise<string | undefined>((resolve) => {
		return ipcMain
			.sendAsync<string | undefined>('send_order', fields)
			.then(resolve)
			.catch(() => resolve(undefined));
	});

export const createOrders = (orders: IOFields[]) => ipcMain.send('send_orders', orders);

export const createDraft = (order: IOFields) =>
	new Promise<number>(async (resolve, reject) => {
		const urls = getBrokerURLs(store.getState());
		if (!urls) {
			reject();
			return;
		}

		try {
			const response = await brokerAxios.post<ServerResponse<number>>(urls.createDraft, {
				price: order.price,
				quantity: order.quantity,
				side: order.orderSide,
				symbolISIN: order.symbolISIN,
				validity: order.validity,
				validityDate: order.validityDate <= 0 ? undefined : order.validityDate,
			});
			const { data } = response;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			refetchActiveOrderTab();
			resolve(data.result);
		} catch (e) {
			reject();
		}
	});

export const updateDraft = (order: IOFieldsWithID) =>
	new Promise<number>(async (resolve, reject) => {
		const urls = getBrokerURLs(store.getState());
		if (!urls) {
			reject();
			return;
		}

		try {
			const response = await brokerAxios.post<ServerResponse<number>>(urls.updateDraft, {
				id: order.id,
				price: order.price,
				quantity: order.quantity,
				side: order.orderSide,
				validity: order.validity,
				validityDate: order.validityDate <= 0 ? undefined : order.validityDate,
			});
			const { data } = response;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			refetchActiveOrderTab();
			resolve(data.result);
		} catch (e) {
			reject();
		}
	});

export const updateOrder = (order: IOFieldsWithID) =>
	new Promise<number>(async (resolve, reject) => {
		const urls = getBrokerURLs(store.getState());
		if (!urls) {
			reject();
			return;
		}

		try {
			const response = await brokerAxios.post<ServerResponse<number>>(urls.updateOrder, {
				parentOrderId: order.id,
				price: order.price,
				quantity: order.quantity,
				side: order.orderSide,
				validity: order.validity,
				validityDate: order.validityDate <= 0 ? undefined : order.validityDate,
			});
			const { data } = response;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			refetchActiveOrderTab();
			resolve(data.result);
		} catch (e) {
			reject();
		}
	});

export const deleteOrder = (ids: number[]) =>
	new Promise<boolean>(async (resolve, reject) => {
		const urls = getBrokerURLs(store.getState());
		if (!urls || ids.length === 0) {
			reject();
			return;
		}

		try {
			const isSingle = ids.length === 1;
			const url = isSingle ? urls.deleteOrder : urls.groupDeleteOrder;

			const response = await brokerAxios.post<ServerResponse<boolean>>(url, {
				orderId: isSingle ? ids[0] : ids,
			});
			const { data } = response;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			refetchActiveOrderTab();
			resolve(data.result);
		} catch (e) {
			reject();
		}
	});

export const deleteDraft = (ids: number[]) =>
	new Promise<boolean>(async (resolve, reject) => {
		const urls = getBrokerURLs(store.getState());
		if (!urls || ids.length === 0) {
			reject();
			return;
		}

		try {
			const isSingle = ids.length === 1;
			const url = isSingle ? urls.deleteDraft : urls.groupDeleteDraft;

			const response = await brokerAxios.post<ServerResponse<boolean>>(url, {
				ordersDraftId: isSingle ? ids[0] : ids,
			});
			const { data } = response;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			refetchActiveOrderTab();
			resolve(data.result);
		} catch (e) {
			reject();
		}
	});

export const refetchActiveOrderTab = () => ipcMain.send('refetch_active_order_tab');
