import { refetchActiveOrderTab, refetchOrdersCount } from '@/utils/orders';
import { toast } from 'react-toastify';

type TMessage = Record<number, string>;

type TResource = Record<string, string>;

class OMSMessagesQueue {
	private readonly _queue = new Map<string, TMessage>();

	private _count: Record<string, number> = {};

	private _orderStatus: TResource = {};

	private _orderErrors: TResource = {};

	private _debounce: NodeJS.Timeout | null = null;

	private readonly _delay = 1000;

	private readonly _closeDuration = 2500;

	constructor() {
		this._loadResources();
	}

	public add(message: TMessage) {
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

		// const clientKey = message[12];
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

		const toastId = orderMessageType || orderStatus;

		if (toast.isActive(toastId)) {
			if (!(toastId in this._count)) this._count[toastId] = 1;
			this._count[toastId] += 1;

			toast.update(toastId, {
				toastId,
				autoClose: this._closeDuration,
				render: (
					<div className='w-full gap-8 flex-items-center'>
						<span className='flex-1'>{messageText}</span>
						<span style={{ flexBasis: '24px' }} className='shrink-0 grow-0'>
							({this._count[toastId] ?? 2})
						</span>
					</div>
				),
			});

			this._clearDebounce();
			this._debounce = setTimeout(() => {
				delete this._count[toastId];
			}, this._closeDuration);
		} else {
			toast[messageType](messageText, {
				toastId,
				autoClose: this._closeDuration,
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

	private _clearDebounce() {
		if (this._debounce) clearTimeout(this._debounce);
	}
}

export default OMSMessagesQueue;
