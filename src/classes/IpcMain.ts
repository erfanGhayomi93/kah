type TChannel = keyof IpcMainChannels;
type ListenerType<T = unknown> = (arg: T) => void;
type AsyncListenerType<T = unknown, R = unknown> = (arg: T) => Promise<R>;
type TChannels = Record<TChannel, [ListenerType[], AsyncListenerType | null]>;

class IpcMain {
	private _channels: Partial<TChannels>;

	constructor() {
		this._channels = {};
	}

	removeHandler<T extends TChannel = TChannel>(channel: T, handler: (arg: IpcMainChannels[T]) => void) {
		try {
			const handlers = this._channels[channel]?.[0];
			if (!handlers) return;

			for (let i = 0; i < handlers.length; i++) {
				const listener = handlers[i];

				if (listener.toString() === handler.toString()) this._channels[channel]![0].splice(i, 1);
			}
		} catch (e) {
			//
		}
	}

	removeAsyncHandler(channel: TChannel) {
		if (channel in this._channels) this._channels[channel]![1] = null;
	}

	removeAllHandlers(channel: TChannel) {
		this._channels[channel] = [[], null];
	}

	removeChannel(channel: TChannel) {
		if (!(channel in this._channels)) return;

		this._channels[channel] = [[], null];
		delete this._channels[channel];
	}

	removeAllChannels(...channels: TChannel[]) {
		try {
			for (let i = 0; i < channels.length; i++) {
				this._channels[channels[i]] = [[], null];
				delete this._channels[channels[i]];
			}
		} catch (e) {
			//
		}
	}

	handle<T extends TChannel = TChannel>(channel: T, listener: ListenerType<IpcMainChannels[T]>) {
		try {
			this._createChannel(channel);
			this._channels[channel]![0].push(listener as ListenerType);
		} catch (error) {
			//
		}
	}

	handleAsync<R, T extends TChannel = TChannel>(
		channel: T,
		listener: AsyncListenerType<IpcMainChannels[T], R | undefined>,
	) {
		try {
			this._createChannel(channel);
			this._channels[channel]![1] = listener as AsyncListenerType;
		} catch (error) {
			//
		}
	}

	send<T extends TChannel = TChannel>(channel: T, arg?: IpcMainChannels[T]) {
		try {
			const ch = this._channels[channel]![0];
			if (!Array.isArray(ch)) return;

			ch.forEach((l) => {
				l.call(null, arg);
			});
		} catch (e) {
			//
		}
	}

	sendAsync<R, T extends TChannel = TChannel>(channel: T, arg?: IpcMainChannels[T]): Promise<R | undefined> {
		return new Promise<R | undefined>(async (resolve, reject) => {
			try {
				const asyncHandler = this._channels[channel]![1];
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

	private _createChannel(cName: TChannel) {
		if (!(cName in this._channels)) this._channels[cName] = [[], null];
	}
}

const ipcMain = Object.freeze(new IpcMain());

export default ipcMain;
