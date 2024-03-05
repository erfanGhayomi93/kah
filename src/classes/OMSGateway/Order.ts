import brokerAxios from '@/api/brokerAxios';

type TOrderState = 'QUEUE' | 'SENDING' | 'SENT' | 'INITIAL';

interface IValidity {
	validity: Extract<TBsValidityDates, 'GoodTillDate' | 'Week' | 'Month'>;
	validityDate: number;
}

interface INonValidityDate {
	validity: Exclude<TBsValidityDates, 'GoodTillDate' | 'Week' | 'Month'>;
}

type IFields = (IValidity | INonValidityDate) & {
	symbolISIN: string;
	quantity: number;
	price: number;
	side: 'buy' | 'sell';
};

class Order {
	private _state: TOrderState = 'INITIAL';

	private _fields: IFields | null = null;

	private _url: string | null = null;

	private _clientKey: string | null = null;

	inQueue() {
		this._state = 'QUEUE';
	}

	setFields(fields: IFields) {
		this._fields = fields;
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

				const response = await brokerAxios.post<ServerResponse<Order.Response>>(this._url, this._fields);
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
