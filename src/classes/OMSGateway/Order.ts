import brokerAxios from '@/api/brokerAxios';

type TOrderState = 'QUEUE' | 'SENDING' | 'SENT' | 'INITIAL';

class Order {
	private _state: TOrderState = 'INITIAL';

	private _fields: IOFields | null = null;

	private _url: string | null = null;

	private _clientKey: string | null = null;

	toQueue() {
		this._state = 'QUEUE';
		return this;
	}

	setFields(fields: IOFields) {
		this._fields = fields;
		if (['Week', 'Month'].includes(this._fields.validity)) {
			this._fields.validity = 'GoodTillDate';
		}

		if (this._fields.validity !== 'GoodTillDate') this._fields.validityDate = -1;

		return this;
	}

	setURL(url: string) {
		this._url = url;
		return this;
	}

	send() {
		this._state = 'SENDING';

		return new Promise<Order.Response>(async (resolve, reject) => {
			try {
				if (!this._url || !this._fields) {
					reject();
					return;
				}

				const params: Partial<IOFields> = { ...this._fields };
				if (params.validityDate === -1) delete params.validityDate;

				const response = await brokerAxios.post<ServerResponse<Order.Response>>(this._url, params);
				const { data } = response;

				if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

				this._clientKey = String(data.result.clientKey ?? '');

				resolve(data.result);
			} catch (e) {
				reject();
			} finally {
				this._state = 'SENT';
			}
		});
	}

	get state() {
		return this._state;
	}

	get clientKey() {
		return this._clientKey;
	}
}

type TOrder = Order;

export type { TOrder };

export default Order;
