type TChannel = keyof IpcMainChannels;
type ListenerType<T = unknown> = (arg: T) => void;
type AsyncListenerType<T = unknown, R = unknown> = (arg: T) => Promise<R>;
type TChannels = Record<TChannel, [ListenerType[], ListenerType[], AsyncListenerType | null]>; // * Handlers, OnceHandlers, AsyncHandlers
type THandlerCallbackF = () => void;

interface IAsyncHandlerOptions {
	async?: boolean;
	signal?: AbortController;
}

interface IHandlerOptions {
	once?: boolean;
	signal?: AbortController;
}

class IpcMain {
	private _channels: Partial<TChannels>;

	constructor() {
		this._channels = {};
	}

	removeAllHandlers(channel: TChannel) {
		this._channels[channel] = [[], [], null];
	}

	removeChannel(channel: TChannel) {
		if (!(channel in this._channels)) return;

		this._channels[channel] = [[], [], null];
		delete this._channels[channel];
	}

	removeAllChannels(...channels: TChannel[]) {
		try {
			for (let i = 0; i < channels.length; i++) {
				this._channels[channels[i]] = [[], [], null];
				delete this._channels[channels[i]];
			}
		} catch (e) {
			//
		}
	}

	handle<T extends keyof IpcMainChannels>(
		channel: T,
		listener: ListenerType<IpcMainChannels[T]>,
		options?: IHandlerOptions,
	): THandlerCallbackF;

	handle<T extends keyof IpcMainChannels, R = unknown>(
		channel: T,
		listener: AsyncListenerType<IpcMainChannels[T], R | undefined>,
		options?: IAsyncHandlerOptions,
	): THandlerCallbackF;

	handle<T extends keyof IpcMainChannels, R = unknown>(
		channel: T,
		listener: ListenerType<IpcMainChannels[T]> | AsyncListenerType<IpcMainChannels[T], R | undefined>,
		options?: IHandlerOptions | IAsyncHandlerOptions,
	): THandlerCallbackF {
		this._createChannel(channel);

		const c = options?.signal ? options.signal : new AbortController();

		if (!options) {
			return this._handler(channel, listener, c);
		}

		if ('async' in options && options.async) {
			return this._asyncHandler(channel, listener as AsyncListenerType<IpcMainChannels[T], R | undefined>, c);
		}

		if ('once' in options && options.once) {
			return this._onceHandler(channel, listener, c);
		}

		return this._handler(channel, listener, c);
	}

	send<T extends TChannel = TChannel>(channel: T, arg: IpcMainChannels[T]) {
		try {
			this._send<typeof channel>(this._channels[channel]![0], arg);
			this._send<typeof channel>(this._channels[channel]![1], arg);
		} catch (e) {
			//
		}
	}

	sendAsync<R, T extends TChannel = TChannel>(channel: T, arg?: IpcMainChannels[T]): Promise<R | undefined> {
		return new Promise<R | undefined>(async (resolve, reject) => {
			try {
				const asyncHandler = this._channels[channel]![2];
				if (!asyncHandler) {
					resolve(undefined);
					return;
				}

				asyncHandler
					.call(null, arg)
					.then((response) => resolve(response as R))
					.catch(reject);
			} catch (e) {
				reject();
			}
		});
	}

	private _handler<T extends TChannel = TChannel>(
		channel: T,
		listener: ListenerType<IpcMainChannels[T]>,
		controller: AbortController,
	) {
		const i = this._channels[channel]![0].push(listener as ListenerType) - 1;
		controller.signal.onabort = () => {
			this._channels[channel]![0].splice(i, 1);
		};

		return () => controller.abort();
	}

	private _onceHandler<T extends TChannel = TChannel>(
		channel: T,
		listener: ListenerType<IpcMainChannels[T]>,
		controller: AbortController,
	) {
		const i = this._channels[channel]![1].push(listener as ListenerType) - 1;
		controller.signal.onabort = () => {
			this._channels[channel]![1].splice(i, 1);
		};

		return () => controller.abort();
	}

	private _asyncHandler<T extends TChannel = TChannel, R = unknown>(
		channel: T,
		listener: AsyncListenerType<IpcMainChannels[T], R | undefined>,
		controller: AbortController,
	) {
		this._createChannel(channel);
		this._channels[channel]![2] = listener as AsyncListenerType;

		controller.signal.onabort = () => {
			this._channels[channel]![2] = null;
		};

		return () => controller.abort();
	}

	private _createChannel(cName: TChannel) {
		if (!(cName in this._channels)) this._channels[cName] = [[], [], null];
	}

	private _send<T extends TChannel = TChannel>(
		handlers: Array<ListenerType<IpcMainChannels[T]>>,
		arg: IpcMainChannels[T],
	) {
		if (!Array.isArray(handlers)) return;
		handlers.forEach((l) => {
			try {
				l.call(null, arg);
			} catch (e) {
				//
			}
		});
	}
}

const ipcMain = Object.freeze(new IpcMain());

export default ipcMain;
