import { subscribePrivateGateWay } from '@/utils/subscriptions';
import { toast } from 'react-toastify';
import { type ItemUpdate, type Subscribe } from '../Subscribe';

class Subscription {
	private _sub: null | Subscribe = null;

	private _brokerCode: null | string = null;

	private _customerISIN: null | string = null;

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
					console.log(value);

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

		if (!orderMessage) {
			const orderStatusMessage = orderStatus;
			const orderErrorMessage = orderMessageType ? `: ${orderMessageType}` : '';

			if (['OnBoard', 'Canceled'].includes(orderStatus)) messageText = orderStatusMessage;
			else messageText = orderStatusMessage + orderErrorMessage;
		}

		toast[messageType](messageText, {
			autoClose: 3500,
		});
	}

	private _AdminMessage(message: Record<number, string>) {
		console.log(message);
	}

	private _SystemMessage(message: Record<number, string>) {
		console.log(message);
	}
}

export default Subscription;
