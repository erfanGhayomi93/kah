import brokerAxios from '@/api/brokerAxios';
import ipcMain from '@/classes/IpcMain';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { store } from '@/features/store';

export const createOrder = (fields: IpcMainChannels['send_order']) =>
	new Promise<Order.Response>((resolve, reject) => {
		return ipcMain
			.sendAsync<Order.Response>('send_order', fields)
			.then((response) => {
				if (response) resolve(response);
				else reject();
			})
			.catch(reject);
	});

export const createOrders = (orders: IpcMainChannels['send_orders']) => ipcMain.send('send_orders', orders);

export const createDraft = (order: IpcMainChannels['send_order']) =>
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
