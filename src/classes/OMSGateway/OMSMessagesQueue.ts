import { refetchActiveOrderTab, refetchOrdersCount } from '@/utils/orders';
import { toast } from 'react-toastify';

type TMessage = Record<number, string>;

type TResource = Record<string, string>;

class OMSMessagesQueue {
	private readonly _queue = new Map<string, TMessage>();

	private _orderStatus: TResource = {};

	private _orderErrors: TResource = {};

	private readonly _delay = 1000;

	constructor() {
		this._loadResources();
	}

	add(message: TMessage) {
		const clientKey = this._getClientKey(message);

		if (!this._queue.has(clientKey)) {
			setTimeout(() => this._checkMessage(clientKey), this._delay);
		}

		this._queue.set(clientKey, message);
	}

	private _checkMessage(clientKey: string) {
		const message = this._queue.get(clientKey);
		if (!message) return;

		this._showMessage(message);

		this._queue.delete(clientKey);
	}

	private _showMessage(message: TMessage) {
		// 208 ? 208 : 22 + 200

		const clientKey = message[12];
		const orderStatus = message[22];
		const orderMessageType = message[200];
		const orderMessage = message[208];

		if (['OnCanceling', 'OnSending', 'InOMSQueue'].includes(orderStatus)) return;

		const messageType: 'success' | 'error' = orderStatus === 'Error' ? 'error' : 'success';
		let messageText = orderMessage ?? '';

		if (!messageText) {
			const orderStatusMessage = this._orderStatus?.[orderStatus] ?? orderStatus;
			const orderErrorMessage = this._orderErrors?.[orderMessageType] ?? orderMessageType;

			if (orderMessageType) messageText = orderStatusMessage + `: ${orderErrorMessage}`;
			else messageText = orderStatusMessage;
		}

		if (toast.isActive(clientKey)) {
			toast.update(messageText, {
				autoClose: 3500,
				toastId: clientKey,
				type: messageType,
			});
		} else {
			toast[messageType](messageText, {
				autoClose: 3500,
				toastId: clientKey,
			});
		}

		refetchActiveOrderTab();
		refetchOrdersCount();
	}

	private _loadResources() {
		try {
			import('../../../languages/fa.json').then((m) => {
				this._orderStatus = m.default.order_status;
				this._orderErrors = m.default.order_errors;
			});
		} catch (e) {
			//
		}
	}

	private _getClientKey(message: TMessage) {
		return message[12];
	}
}

export default OMSMessagesQueue;
