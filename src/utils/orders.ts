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

export const createDraft = (fields: IpcMainChannels['send_order']) =>
	new Promise<number>(async (resolve, reject) => {
		const urls = getBrokerURLs(store.getState());
		if (!urls) {
			reject();
			return;
		}

		try {
			const response = await brokerAxios.post<ServerResponse<number>>(urls.createDraft, {
				price: fields.price,
				quantity: fields.quantity,
				side: fields.orderSide,
				symbolISIN: fields.symbolISIN,
				validity: fields.validity,
				validityDate: fields.validityDate <= 0 ? null : fields.validityDate,
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
