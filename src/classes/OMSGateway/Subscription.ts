/* eslint-disable no-console */
import { subscribePrivateGateWay } from '@/utils/subscriptions';
import { type ItemUpdate, type Subscribe } from '../Subscribe';
import OMSMessagesQueue from './OMSMessagesQueue';

class Subscription {
	private _sub: null | Subscribe = null;

	private _brokerCode: null | string = null;

	private _customerISIN: null | string = null;

	private readonly _omsMessageQueue = new OMSMessagesQueue();

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
		this._omsMessageQueue.add(message);
	}

	private _AdminMessage(message: Record<number, string>) {
		//
	}

	private _SystemMessage(message: Record<number, string>) {
		//
	}
}

export default Subscription;
