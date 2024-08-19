import { type TOrder } from './Order';

class Publish {
	private queue: TOrder[] = []; // QUEUE

	private readonly cache = new Map<string, TOrder>(); // AFTER-QUEUE

	private readonly _timing = new Map<string, number>(); // Order timing

	private _sendingIndex: number = -1; // Current order index in Queue

	private _sending: boolean = false; // Queue is sending the orders

	private readonly _debounce = 310; // time as milliseconds  between orders with same symbolISIN

	public start(): void {
		if (this._sending || this.queue.length === 0) return;

		this._sending = true;
		this._sendingIndex = 0;

		this.send();
	}

	public send(): void {
		const order = this.order;
		if (!order) return this._onFindingOrderFailed();

		const orderCreatedAt = this._timing.get(order.symbolISIN);
		let updatedAt = Date.now();

		if (!orderCreatedAt) {
			this._sendOrder(order);
		} else {
			const diff = orderCreatedAt - Date.now();
			let ms = diff + this._debounce;
			ms = Math.max(0, ms);

			updatedAt += ms;

			this._delay(() => this._sendOrder(order), ms);
		}

		this._timing.set(order.symbolISIN, updatedAt);
		this._sendNextOrder();
	}

	public add(orders: TOrder[]): void {
		this._addOrders(orders);
		this.start();
	}

	private _sendOrder(order: TOrder) {
		order.send().then((response) => {
			this.cache.set(response.clientKey, order);
		});
	}

	private _sendNextOrder() {
		this._sendingIndex += 1;

		if (this.order === undefined) this._restart();
		else this.send();
	}

	private _restart() {
		this._flush();
		this.start();
	}

	private _onFindingOrderFailed(): void {
		//
	}

	private _addOrders(orders: TOrder[]): void {
		this.queue.push(...orders);
	}

	private _flush() {
		this._sendingIndex = -1;
		this._sending = false;
		this._clearQueue();
	}

	private _clearQueue(): void {
		this.queue = [];
	}

	private _delay(cb: () => void, ms: number): void {
		if (ms === 0) cb();
		else setTimeout(() => cb(), ms);
	}

	get order(): TOrder | undefined {
		return this.queue[this._sendingIndex] ?? undefined;
	}
}

export default Publish;
