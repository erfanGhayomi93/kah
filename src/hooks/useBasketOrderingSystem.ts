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
	onOrderRemoved?: (item: OrderBasket.Order) => void;
	onOrdersSent?: (items: IOrdersSentEvent) => void;
	onOrderSentSuccessfully?: (item: OrderBasket.Order) => void;
}

const useBasketOrderingSystem = ({ onOrderSentSuccessfully, onOrdersSent, onOrderRemoved }: IOptions = {}) => {
	const sendingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const basketSnapshot = useRef<OrderBasket.Order[]>([]);

	const sentOrders = useRef<TOrderResult[]>([]);

	const [submitting, setSubmitting] = useState(false);

	const dispatch = useAppDispatch();

	const showLoginModal = () => dispatch(setLoginModal({}));

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
		onOrderRemoved?.(item);

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

		if (onOrdersSent) {
			const failedOrders = sentOrders.current.filter((order) => {
				return order.result.id && order.result.response !== 'error';
			});

			onOrdersSent({
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
				validity: 'Day',
				validityDate: 0,
			});

			if (uuid) addNewHandler(item, uuid);
			else onOrderSentSuccessfully?.(item);

			if (index < basketSnapshot.current.length - 1) sendOrder(index + 1);
		} catch (e) {
			//
		}
	};

	const addNewHandler = (item: OrderBasket.Order, id: string) => {
		const removeHandler = ipcMain.handle('order_sent', onOrderMessageReceived(item, id), { once: true });

		if (sendingTimeoutRef.current) clearTimeout(sendingTimeoutRef.current);

		sendingTimeoutRef.current = setTimeout(() => {
			onOrderSentSuccessfully?.(item);
			removeHandler();
		}, 2000);
	};

	return { submit, submitting };
};

export default useBasketOrderingSystem;
