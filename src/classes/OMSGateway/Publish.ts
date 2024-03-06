import { type TOrder } from './Order';

interface IAddOrderConfiguration {
	startSending: boolean;
	type: 'push' | 'unshift';
}

class Publish {
	private queue: TOrder[] = []; // QUEUE

	private readonly sent = new Map<string, TOrder>(); // After-QUEUE

	private _sendingIndex: number = -1;

	private _isSending: boolean = false;

	private readonly _debounce = 1000;

	start() {
		if (this.queue.length === 0) return;

		if (this._isSending) return;
		else this._isSending = true;

		this._delay(() => {
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
				.finally(() => this._sendNextOrder());
		});
	}

	add(orders: TOrder[], options?: IAddOrderConfiguration) {
		if (options?.type === 'unshift') this.queue.unshift(...orders);
		else this.queue.push(...orders);

		if (options?.startSending) this.start();
	}

	addAndStart(orders: TOrder[]) {
		this.add(orders, { startSending: true, type: 'push' });
	}

	private _end() {
		this._isSending = false;

		if (this.queue.length > 0) this.start();
		else this._reset();
	}

	private _sendNextOrder() {
		this.queue.splice(this._sendingIndex, 1);

		this._sendingIndex++;
		if (this.order) this._delay(() => this.order && this.send(this.order));
		else this._end();
	}

	private _reset() {
		this._sendingIndex = -1;
		this.queue = [];
	}

	private _delay(callback: () => void) {
		setTimeout(() => callback(), this._debounce);
	}

	get order() {
		return this.queue[this._sendingIndex];
	}
}

export default Publish;
