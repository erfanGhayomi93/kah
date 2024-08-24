import ipcMain from '@/classes/IpcMain';
import { useAppDispatch } from '@/features/hooks';
import { setChoiceBrokerModal, setLoginModal } from '@/features/slices/modalSlice';
import { setBrokerIsSelected } from '@/features/slices/userSlice';
import { getBrokerClientId, getClientId } from '@/utils/cookie';
import { createOrder } from '@/utils/orders';
import { useRef, useState } from 'react';

interface TOrderResult {
	order: OrderBasket.Order;
	result: IpcMainChannels['order_sent'];
}

interface IOrdersSentEvent {
	failedOrders: TOrderResult[];
	sentOrders: TOrderResult[];
}

interface IOptions {
	onRemoved?: (item: OrderBasket.Order) => void;
	onSingleSent?: (item: OrderBasket.Order) => void;
	onSent?: (items: IOrdersSentEvent) => void;
}

const useBasketOrderingSystem = ({ onSent, onSingleSent, onRemoved }: IOptions = {}) => {
	const sendingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const basketSnapshot = useRef<OrderBasket.Order[]>([]);

	const sentOrders = useRef<TOrderResult[]>([]);

	const [submitting, setSubmitting] = useState(false);

	const dispatch = useAppDispatch();

	const showLoginModal = () => dispatch(setLoginModal({ showForceLoginAlert: true }));

	const showChoiceBrokerModal = () => {
		dispatch(setBrokerIsSelected(false));
		dispatch(setChoiceBrokerModal({}));
	};

	const submit = (data: OrderBasket.Order[]) => {
		if (data.length === 0) return;

		try {
			validation();

			basketSnapshot.current = JSON.parse(JSON.stringify(data)) as OrderBasket.Order[];

			setSubmitting(true);
			sendOrder(0);
		} catch (e) {
			//
		}
	};

	const validation = () => {
		const clientId = getClientId();
		if (!clientId) {
			showLoginModal();
			throw new Error('login_to_your_account');
		}

		const bClientId = getBrokerClientId();
		if (!bClientId[0]) {
			showChoiceBrokerModal();
			throw new Error('broker_error');
		}
	};

	const onOrderMessageReceived = (item: OrderBasket.Order, id: string) => (result: IpcMainChannels['order_sent']) => {
		if (id !== result.id) return;
		onRemoved?.(item);

		sentOrders.current.push({
			order: item,
			result,
		});

		basketSnapshot.current = basketSnapshot.current.filter(({ id }) => item.id !== id);
		if (basketSnapshot.current.length === 0) onAllOrdersSent();
	};

	const onAllOrdersSent = () => {
		sentOrders.current = [];

		setSubmitting(false);

		if (onSent) {
			const failedOrders = sentOrders.current.filter((order) => {
				return order.result.id && order.result.response !== 'error';
			});

			onSent({
				failedOrders,
				sentOrders: sentOrders.current,
			});
		}
	};

	const sendOrder = async (index: number) => {
		try {
			const item = basketSnapshot.current[index];
			if (!item) throw new Error('Item not found!');

			if (!item.symbol.symbolISIN) throw new Error('symbolISIN not found!');

			const uuid = await createOrder({
				symbolISIN: item.symbol.symbolISIN,
				quantity: item.quantity,
				price: item.price,
				orderSide: item.side,
				source: item.type === 'option' && item.side === 'sell' ? 'Portfolio' : undefined,
				validity: 'Day',
				validityDate: 0,
			});

			if (uuid) addNewHandler(item, uuid);
			else onSingleSent?.(item);

			if (index < basketSnapshot.current.length - 1) sendOrder(index + 1);
		} catch (e) {
			//
		}
	};

	const addNewHandler = (item: OrderBasket.Order, id: string) => {
		const removeHandler = ipcMain.handle('order_sent', onOrderMessageReceived(item, id), { once: true });

		if (sendingTimeoutRef.current) clearTimeout(sendingTimeoutRef.current);

		sendingTimeoutRef.current = setTimeout(() => {
			onSingleSent?.(item);
			removeHandler();
		}, 2000);
	};

	return { submit, submitting };
};

export const getBasketAlertMessage = (failedOrdersLength: number, sentOrdersLength: number) => {
	return failedOrdersLength === 0
		? 'alerts.orders_sent_successfully'
		: failedOrdersLength === sentOrdersLength
			? 'alerts.orders_sent_failed'
			: failedOrdersLength >= sentOrdersLength / 2
				? 'alerts.some_orders_sent_successfully'
				: 'alerts.most_orders_sent_successfully';
};

export default useBasketOrderingSystem;
