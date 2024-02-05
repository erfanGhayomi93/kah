import { Subscription, type LightstreamerClient, type SubscriptionListener } from 'lightstreamer-client-web';
import { type SubscriptionOptions } from './lightstream.d';

class Subscribe {
	private readonly connection: LightstreamerClient;
	public subscribe: Subscription;
	public fields: string[];
	public items: string[];

	private readonly _options: SubscriptionOptions;
	private _handlers: SubscriptionListener = {};

	constructor(connection: LightstreamerClient, options: SubscriptionOptions) {
		this.connection = connection;

		this.fields = 'fields' in options ? options.fields : [];
		this.items = 'items' in options ? options.items : [];
		this._options = options;

		/* Initial setup */
		this.subscribe = new Subscription(options.mode);
	}

	addEventListener<T extends keyof SubscriptionListener>(channel: T, listener: SubscriptionListener[T]) {
		this._handlers = {
			...this._handlers,
			[channel]: listener,
		};

		return this;
	}

	removeEventListener(channel: keyof SubscriptionListener) {
		delete this._handlers[channel];

		return this;
	}

	start() {
		if (!this.isActive()) {
			this._setup();
			this.connection.subscribe(this.subscribe);
		}

		return this;
	}

	unsubscribe() {
		if (this.subscribe && this.isActive()) {
			this.connection.unsubscribe(this.subscribe);
		}

		return this;
	}

	setFields(args: string[]) {
		this.fields = args;

		return this;
	}

	addField(field: string) {
		this.fields.push(field);

		return this;
	}

	setItems(args: string[]) {
		this.items = args;

		return this;
	}

	addItem(item: string) {
		this.items.push(item);

		return this;
	}

	setSnapshot(val: boolean) {
		this._options.snapshot = val;
		return this;
	}

	isActive() {
		return this.subscribe.isActive();
	}

	/* Private */
	private _setup() {
		try {
			this.subscribe.setItems(this.items.filter(Boolean));
			this.subscribe.setFields(this.fields);
			this.subscribe.setDataAdapter(this._options.dataAdapter);
			if (this._options.mode === 'MERGE')
				this.subscribe.setRequestedSnapshot(this._options.snapshot ? 'yes' : 'no');

			this.subscribe.addListener(this._handlers);
		} catch (e) {
			//
		}
	}
}

export default Subscribe;
