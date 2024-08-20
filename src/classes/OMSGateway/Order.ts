import brokerAxios from '@/api/brokerAxios';
import { toISOStringWithoutChangeTime } from '@/utils/helpers';
import ipcMain from '../IpcMain';

class Order {
	private _symbolISIN: string = '';

	private _uuid: string | undefined = undefined;

	private _fields: IOFields | null = null;

	private _url: string | null = null;

	private _clientKey: string | null = null;

	setFields(fields: IOFields) {
		this._symbolISIN = fields.symbolISIN;
		this._fields = fields;

		if (['Week', 'Month'].includes(this._fields.validity)) {
			this._fields.validity = 'GoodTillDate';
		}

		if (this._fields.validity !== 'GoodTillDate') this._fields.validityDate = -1;

		return this;
	}

	setUUID(id: string) {
		this._uuid = id;
		return this;
	}

	setURL(url: string) {
		this._url = url;
		return this;
	}

	send() {
		return new Promise<Order.Response>(async (resolve, reject) => {
			try {
				if (!this._url || !this._fields) {
					reject();
					return;
				}

				const params: Partial<IOFields> = { ...this._fields };

				if (params.validityDate === undefined || params.validityDate <= 0) {
					delete params.validityDate;
				}

				const response = await brokerAxios.post<ServerResponse<Order.Response>>(this._url, {
					...params,
					validityDate: params?.validityDate
						? toISOStringWithoutChangeTime(new Date(params.validityDate))
						: undefined,
				});
				const { data } = response;

				if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

				this._clientKey = String(data.result.clientKey ?? '');

				this._pushToIpcMain(data.result);
				resolve(data.result);
			} catch (e) {
				this._pushToIpcMain('error');
				reject();
			}
		});
	}

	private _pushToIpcMain(result: Order.Response | 'error') {
		ipcMain.send('order_sent', {
			id: this._uuid,
			response: result,
		});
	}

	get clientKey() {
		return this._clientKey;
	}

	get symbolISIN() {
		return this._symbolISIN;
	}
}

type TOrder = Order;

export type { TOrder };

export default Order;
