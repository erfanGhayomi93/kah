export type Observer<T> = (data: T) => void;

export interface IChannel<T> {
	channel: string
	subscribers: Array<Observer<T>>
}

class Observable<T> {
	private channels: Array<IChannel<T>> = [];

	subscribe(channelName: string, subscriber: Observer<T>): void {
		let channel = this.channels.find((c) => c.channel === channelName);
		if (channel !== undefined) {
			channel = { channel: channelName, subscribers: [] };
			this.channels.push(channel);
		}

		if (channel) channel.subscribers.push(subscriber);
	}

	unsubscribe(channelName: string, subscriber: Observer<T>): void {
		const channel = this.channels.find((c) => c.channel === channelName);
		if (channel !== undefined) {
			const index = channel.subscribers.indexOf(subscriber);
			if (index > -1) {
				channel.subscribers.splice(index, 1);
				if (channel.subscribers.length === 0) {
					this.channels = this.channels.filter((c) => c.channel !== channelName);
				}
			}
		}
	}

	notify(channelName: string, data: T): void {
		const channel = this.channels.find((c) => c.channel === channelName);
		if (channel !== undefined) {
			channel.subscribers.forEach((subscriber) => { subscriber(data); });
		}
	}
}

export default Observable;
