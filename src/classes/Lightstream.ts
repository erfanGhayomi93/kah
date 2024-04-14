import routes from '@/api/routes';
import { getBrokerClientId } from '@/utils/cookie';
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
	private _username: string | 'anonymous' = 'anonymous';

	/* Subscriptions */
	private readonly _subscriptions: Subscribe[] = [];

	/* Handlers */
	private _handlers: ClientListener = {};

	constructor() {
		this.connection = new LightstreamerClient();
		this.adapter = 'Ramand_Remoter_Adapter';

		/* Private */
		this._address = routes.pushengine;
		this._port = '443';

		Object.seal(this);
	}

	start() {
		this._setup();
		this.connection.addListener(this._handlers);

		// connect
		this._connect();
		return this;
	}

	restart() {
		this._disconnect();

		setTimeout(() => {
			this.connection.connectionDetails.setUser(this._username);
			if (this._username === 'anonymous') this.connection.connectionDetails.setPassword('anonymous');
			else this.setPassword();

			this._connect();
		}, 250);
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

	setUsername(username: null | string) {
		this._username = username ?? 'anonymous';
		return this;
	}

	setPassword() {
		const password = getBrokerClientId()[0] ?? 'anonymous';
		this.connection.connectionDetails.setPassword(password);
	}

	/* Getters */
	get serverAddress(): string {
		return this._address + ':' + this._port;
	}

	/* Private */
	private _setup() {
		this.connection.connectionDetails.setServerAddress(this.serverAddress);
		this.connection.connectionDetails.setAdapterSet(this.adapter);
		this.connection.connectionDetails.setUser(this._username);
		if (this._username === 'anonymous') this.connection.connectionDetails.setPassword('anonymous');
		else this.setPassword();
	}

	private _connect() {
		if (this.connection) this.connection.connect();
	}

	private _disconnect() {
		if (this.connection) this.connection.disconnect();
	}
}

const lightStreamInstance = new Lightstream();

export type { Lightstream };

export default lightStreamInstance;
