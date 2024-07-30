/* eslint-disable no-console */
import { brokerQueryClient } from '@/components/common/Registry/QueryClientRegistry';
import { refetchActiveOrderTab } from '@/utils/orders';
import { subscribePrivateGateWay } from '@/utils/subscriptions';
import { toast } from 'react-toastify';
import { type ItemUpdate, type Subscribe } from '../Subscribe';

class Subscription {
	private _sub: null | Subscribe = null;

	private _brokerCode: null | string = null;

	private _customerISIN: null | string = null;

	private _orderStatus: Record<string, string> = {};

	private _orderErrors: Record<string, string> = {};

	constructor() {
		import('../../../languages/fa.json').then((m) => {
			this._orderStatus = m.default.order_status;
			this._orderErrors = m.default.order_errors;
		});
	}

	setBrokerCode(v: string) {
		this._brokerCode = v;
		return this;
	}

	setCustomerISIN(v: string) {
		this._customerISIN = v;
		return this;
	}

	start() {
		this.stop();

		if (!this._brokerCode || !this._customerISIN) return;

		this._sub = subscribePrivateGateWay(this._brokerCode, this._customerISIN)
			.addEventListener('onItemUpdate', (updateInfo) => this._onMessage(updateInfo))
			.start();
	}

	stop() {
		if (!this._sub) return;

		this._sub.unsubscribe();
		this._sub = null;
	}

	private _onMessage(updateInfo: ItemUpdate) {
		updateInfo.forEachChangedField((fieldName, _, value) => {
			try {
				if (value) {
					const m = this._beautify(value);

					if (fieldName === 'OMSMessage') this._OMSMessage(m);
					else if (fieldName === 'AdminMessage') this._AdminMessage(m);
					else if (fieldName === 'SystemMessage') this._SystemMessage(m);
				}
			} catch (e) {
				//
			}
		});
	}

	private _beautify(v: string) {
		const message = v.split('^');
		const msgObj: Record<number, string> = {};

		try {
			message.forEach((item) => {
				if (item) {
					const [index, value] = item.split('=');
					msgObj[Number(index)] = value;
				}
			});
		} catch (e) {
			//
		}

		return msgObj;
	}

	private _OMSMessage(message: Record<number, string>) {
		// 208 ? 208 : 22 + 200
		// const clientKey = message[12];
		const orderStatus = message[22];
		const orderMessageType = message[200];
		const orderMessage = message[208];

		if (['OnCanceling', 'OnSending', 'InOMSQueue'].includes(orderStatus)) return;

		const messageType: 'success' | 'error' = orderStatus === 'Error' ? 'error' : 'success';
		let messageText = orderMessage ?? '';

		const orderStatusMessage = this._orderStatus?.[orderStatus] ?? orderStatus;
		const orderErrorMessage = this._orderErrors?.[orderMessageType] ?? orderMessageType;

		if (!orderMessage) {
			if (['OnBoard', 'Canceled'].includes(orderStatus)) messageText = orderStatusMessage;
			else messageText = orderStatusMessage + `: ${orderErrorMessage}`;
		}

		refetchActiveOrderTab();

		toast[messageType](messageText, {
			autoClose: 3500,
			toastId: orderStatus,
		});

		try {
			brokerQueryClient!.refetchQueries({
				queryKey: ['brokerOrdersCountQuery'],
			});
		} catch (e) {
			//
		}
	}

	private _AdminMessage(message: Record<number, string>) {
		//
	}

	private _SystemMessage(message: Record<number, string>) {
		//
	}
}

export default Subscription;
