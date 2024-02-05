import { LightstreamerClient, type ClientListener } from 'lightstreamer-client-web';
import Subscribe from './Subscribe';
import { type SubscriptionOptions } from './lightstream.d';

class Lightstream {
	/* Public */
	public connection: LightstreamerClient;
	public adapter: string;

	/* Private */
	private readonly _address: string;
	private readonly _port: string;
	private readonly _password: string;

	/* Subscriptions */
	private readonly _subscriptions: Subscribe[] = [];

	/* Handlers */
	private _handlers: ClientListener = {};

	constructor() {
		this.connection = new LightstreamerClient();
		this.adapter = 'Ramand_Remoter_Adapter';

		/* Private */
		this._address = 'https://pushengine.ramandtech.com';
		this._port = '443';
		this._password = 'anonymous';
	}

	start(username = 'anonymous') {
		this._setup(username);
		this.connection.addListener(this._handlers);

		// connect
		this._connect();
		return this;
	}

	getStatus() {
		return this.connection.getStatus();
	}

	subscribe(options: SubscriptionOptions) {
		const subscribe = new Subscribe(this.connection, options);
		this._subscriptions.push(subscribe);

		return subscribe;
	}

	addEventListener<T extends keyof ClientListener>(channel: T, listener: ClientListener[T]) {
		this._handlers[channel] = listener;

		return this;
	}

	removeEventListener(channel: keyof ClientListener) {
		delete this._handlers[channel];

		return this;
	}

	disconnect() {
		this.connection.disconnect();
	}

	/* Getters */
	get serverAddress(): string {
		return this._address + ':' + this._port;
	}

	/* Private */
	private _setup(username: string) {
		this.connection.connectionDetails.setServerAddress(this.serverAddress);
		this.connection.connectionDetails.setAdapterSet(this.adapter);
		this.connection.connectionDetails.setUser(username);
		this.connection.connectionDetails.setPassword(this._password);

		return {
			start: (username = 'anonymous') => this.start(username),
		};
	}

	private _connect() {
		if (this.connection) this.connection.connect();
	}
}

const lightStreamInstance = Object.freeze(new Lightstream());

export default lightStreamInstance;
