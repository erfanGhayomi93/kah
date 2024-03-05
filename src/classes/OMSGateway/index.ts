import Order from './Order';
import Publish from './Publish';
import Subscription from './Subscription';

class OMS {
	private readonly _publish = new Publish();

	private readonly _subscription = new Subscription();

	private readonly _order = new Order();

	constructor() {
		Object.seal(this);
	}

	publish() {
		return this._publish;
	}

	subscription() {
		return this._subscription;
	}

	order() {
		return this._order;
	}
}

const OMSGateway = new OMS();
export default OMSGateway;
