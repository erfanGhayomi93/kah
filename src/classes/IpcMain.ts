type ListenerType<T = unknown> = (arg: T) => void;
type AsyncListenerType<T = unknown, R = unknown> = (arg: T) => Promise<R>;
type IChannels = Record<string, [ListenerType[], AsyncListenerType | null]>;

class IpcMain {
	private _channels: IChannels;

	constructor() {
		this._channels = {};
	}

	removeHandler<T>(channel: string, handler: (arg: T) => void) {
		const handlers = this._channels[channel][0];
		for (let i = 0; i < handlers.length; i++) {
			const listener = handlers[i];

			if (listener.toString() === handler.toString()) this._channels[channel].splice(i, 1);
		}
	}

	removeAsyncHandler(channel: string) {
		this._channels[channel][1] = null;
	}

	removeAllHandlers(channel: string) {
		this._channels[channel] = [[], null];
	}

	removeChannel(channel: string) {
		if (!(channel in this._channels)) return;

		this._channels[channel] = [[], null];
		delete this._channels[channel];
	}

	removeAllChannels(...channels: string[]) {
		for (let i = 0; i < channels.length; i++) {
			this._channels[channels[i]] = [[], null];
			delete this._channels[channels[i]];
		}
	}

	handle<T>(channel: string, listener: ListenerType<T>) {
		if (!(channel in this._channels)) this._channels[channel] = [[], null];

		this._channels[channel][0].push(listener as ListenerType);
	}

	handleAsync<T, R>(channel: string, listener: AsyncListenerType<T, R>) {
		if (!(channel in this._channels)) this._channels[channel] = [[], null];

		this._channels[channel][1] = listener as AsyncListenerType;
	}

	send<T>(channel: string, arg?: T) {
		const ch = this._channels[channel];
		if (!Array.isArray(ch)) return;

		ch[0].forEach((l) => {
			l.call(null, arg);
		});
	}

	sendAsync<T, R>(channel: string, arg?: T): Promise<R | undefined> {
		return new Promise<R | undefined>(async (resolve, reject) => {
			try {
				const asyncHandler = this._channels[channel][1];
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
}

const ipcMain = Object.freeze(new IpcMain());

export default ipcMain;
