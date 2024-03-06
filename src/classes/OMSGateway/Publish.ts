import { type TOrder } from './Order';

interface IForcibleOrder {
	startSending: true;
	force: true;
	forceType: 'push' | 'unshift';
}

interface IInQueueOrder {
	startSending: true;
	force: false;
}

interface IInStoreOrder {
	startSending?: false;
}

type TAddOrderConfiguration = IInQueueOrder | IInStoreOrder | IForcibleOrder;

class Publish {
	private store: TOrder[] = []; // Pre-QUEUE

	private queue: TOrder[] = []; // QUEUE

	private readonly sent = new Map<string, TOrder>(); // After-QUEUE

	private _sendingIndex: number = -1;

	private readonly _debounce = 1000;

	start() {
		this._delay(() => {
			if (this.queue.length === 0) return;

			this._sendingIndex = 0;
			this.send(this.order);
		});
	}

	send(order: TOrder | undefined) {
		return new Promise<Order.Response>((resolve, reject) => {
			if (!order) {
				reject();
				return;
			}

			order
				.send()
				.then((result) => {
					this.sent.set(result.clientKey, order);
					resolve(result);
				})
				.catch(reject)
				.finally(() => {
					if (!this.queue[this._sendingIndex + 1]) this._end();
					else this._sendNextOrder();
				});
		});
	}

	add(orders: TOrder[], options?: TAddOrderConfiguration) {
		this.store.push(...orders);

		if (options?.startSending) {
			if (options.force || this.queue.length === 0)
				this._setQueueAndStart(options.force ? options.forceType : 'push');
			else this.start();
		}
	}

	addAndStart(orders: TOrder[]) {
		this.add(orders, { startSending: true, force: false });
	}

	private _end() {
		if (this.store.length > 0 || this.queue.length > 0) {
			this._setQueueAndStart();
		} else {
			this._reset();
		}
	}

	private _setQueueAndStart(type: IForcibleOrder['forceType'] = 'push') {
		if (type === 'push') this.queue.push(...this.store);
		else this.queue.unshift(...this.store);
		this.store = [];

		this.start();
	}

	private _sendNextOrder() {
		delete this.queue[this._sendingIndex];

		this._sendingIndex++;
		this._delay(() => this.send(this.order));
	}

	private _resetStore() {
		this.store = [];
	}

	private _resetQueue() {
		this.queue = [];
	}

	private _reset() {
		this._sendingIndex = -1;
		this._resetStore();
		this._resetQueue();
	}

	private _delay(callback: () => void) {
		setTimeout(() => callback(), this._debounce);
	}

	get order() {
		return this.queue[this._sendingIndex];
	}
}

export default Publish;
