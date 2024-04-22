import ipcMain from '@/classes/IpcMain';
import Button from '@/components/common/Button';
import { ArrowDownSVG, MaximizeSVG, MinimizeSVG, XSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { setAnalyzeModal, setChoiceBrokerModal, setConfirmModal, setLoginModal } from '@/features/slices/modalSlice';
import {
	getIsLoggedIn,
	getOrderBasket,
	setBrokerIsSelected,
	setOrderBasket,
	setOrderBasketOrders,
} from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { getBrokerClientId, getClientId } from '@/utils/cookie';
import { createOrder } from '@/utils/orders';
import { createSelector } from '@reduxjs/toolkit';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

const SymbolStrategyTable = dynamic(() => import('@/components/common/Tables/SymbolStrategyTable'), {
	ssr: false,
	loading: () => (
		<div style={{ minHeight: '7.2rem' }} className='relative w-full flex-justify-center'>
			<div className='size-36 spinner' />
		</div>
	),
});

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		isLoggedIn: getIsLoggedIn(state),
		brokerURLs: getBrokerURLs(state),
		basket: getOrderBasket(state)!,
	}),
);

const Basket = () => {
	const t = useTranslations();

	const {
		isLoggedIn,
		brokerURLs,
		basket: { baseSymbol, orders: basketOrders },
	} = useAppSelector(getStates);

	const sendingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const basketSnapshot = useRef<OrderBasket.Order[]>([]);

	const sentOrders = useRef<Array<{ order: OrderBasket.Order; result: IpcMainChannels['order_sent'] }>>([]);

	const dispatch = useAppDispatch();

	const [submitting, setSubmitting] = useState(false);

	const [isMaximized, setIsMaximized] = useState(true);

	const [selectedContracts, setSelectedContracts] = useState<OrderBasket.Order[]>([]);

	const close = () => {
		dispatch(setOrderBasket(null));
	};

	const analyze = () => {
		dispatch(
			setAnalyzeModal({
				symbol: {
					symbolTitle: baseSymbol.symbolTitle,
					symbolISIN: baseSymbol.symbolISIN,
				},
				contracts: basketOrders ?? [],
			}),
		);
	};

	const showLoginModal = () => dispatch(setLoginModal({}));

	const showChoiceBrokerModal = () => dispatch(setChoiceBrokerModal({}));

	const onClose = () => {
		if (basketOrders.length === 1) close();
		else {
			dispatch(
				setConfirmModal({
					title: t('order_basket.delete_order_basket'),
					description: t('order_basket.empty_order_basket'),
					onSubmit: close,
					confirm: {
						label: t('common.delete'),
						type: 'error',
					},
				}),
			);
		}
	};

	const onExpand = () => {
		setIsMaximized(!isMaximized);
	};

	const filterBasketItems = (itemId: string) => (item: OrderBasket.Order) => {
		return item.id !== itemId;
	};

	const removeOrder = (id: string) => {
		dispatch(setOrderBasketOrders(basketOrders.filter(filterBasketItems(id))));
		setSelectedContracts((prev) => prev.filter(filterBasketItems(id)));
	};

	const validation = () => {
		const clientId = getClientId();
		if (!clientId) {
			dispatch(setLoginModal({}));
			throw new Error('login_to_your_account');
		}

		const bClientId = getBrokerClientId();
		if (!bClientId[0]) {
			dispatch(setBrokerIsSelected(false));
			dispatch(setChoiceBrokerModal({}));
			throw new Error('broker_error');
		}
	};

	const onSubmit = () => {
		if (selectedContracts.length === 0) return;
		else if (!isLoggedIn) showLoginModal();
		else if (!brokerURLs) showChoiceBrokerModal();
		else {
			try {
				validation();

				basketSnapshot.current = JSON.parse(JSON.stringify(basketOrders)) as OrderBasket.Order[];

				setSubmitting(true);
				sendOrder(0);
			} catch (e) {
				//
			}
		}
	};

	const onOrderMessageReceived = (item: OrderBasket.Order, id: string) => (result: IpcMainChannels['order_sent']) => {
		if (id !== result.id) return;
		removeOrder(item.id);

		sentOrders.current.push({
			order: item,
			result,
		});

		if (basketSnapshot.current.length === 0) onOrdersSent();
	};

	const onOrderSentSuccessfully = (item: OrderBasket.Order) => {
		//
	};

	const onOrdersSent = () => {
		const failedOrdersLength = sentOrders.current.reduce((total, order) => {
			if (!order.result.id || order.result.response === 'error') return total + 1;
			return total;
		}, 0);

		const message =
			failedOrdersLength === 0
				? 'alerts.orders_sent_successfully'
				: failedOrdersLength === sentOrders.current.length
					? 'alerts.orders_sent_failed'
					: failedOrdersLength >= sentOrders.current.length / 2
						? 'alerts.some_orders_sent_successfully'
						: 'alerts.most_orders_sent_successfully';

		toast.success(t(message));

		sentOrders.current = [];
	};

	const sendOrder = async (index: number) => {
		try {
			const item = selectedContracts[index];
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
			else onOrderSentSuccessfully(item);

			if (index < selectedContracts.length - 1) sendOrder(index + 1);
			else setSubmitting(false);
		} catch (e) {
			setSubmitting(false);
		}
	};

	const setOrderProperty = <T extends keyof OrderBasket.Order>(
		id: string,
		property: T,
		value: OrderBasket.Order[T],
	) => {
		const orders = JSON.parse(JSON.stringify(basketOrders)) as OrderBasket.Order[];

		const orderIndex = orders.findIndex((item) => item.id === id);
		if (orderIndex === -1) return;

		orders[orderIndex][property] = value;

		dispatch(setOrderBasketOrders(orders));
	};

	const addNewHandler = (item: OrderBasket.Order, id: string) => {
		const removeHandler = ipcMain.handle('order_sent', onOrderMessageReceived(item, id), { once: true });

		if (sendingTimeoutRef.current) clearTimeout(sendingTimeoutRef.current);

		sendingTimeoutRef.current = setTimeout(() => {
			onOrderSentSuccessfully(item);
			removeHandler();
		}, 2000);
	};

	useEffect(() => {
		const lastItem = basketOrders[basketOrders.length - 1];
		if (!lastItem) return;

		if (selectedContracts.findIndex((item) => item.id === lastItem.id) > -1) return;

		setSelectedContracts([...selectedContracts, lastItem]);
	}, [basketOrders.length]);

	return (
		<div
			style={{
				right: '6.4rem',
				width: isMaximized ? '80rem' : '41.6rem',
				zIndex: 99,
			}}
			className='fixed bottom-8'
		>
			<div className='overflow-hidden rounded bg-white shadow-card'>
				<div className='relative h-56 w-full bg-gray-200 flex-justify-center'>
					<h2 className='text-xl font-medium'>{t('order_basket.title')}</h2>

					<div className='absolute left-24 gap-16 flex-items-center'>
						<button onClick={onExpand} type='button' className='icon-hover'>
							{isMaximized ? (
								<MinimizeSVG width='2rem' height='2rem' />
							) : (
								<MaximizeSVG width='1.5rem' height='1.5rem' />
							)}
						</button>

						<button onClick={onClose} type='button' className='icon-hover'>
							<XSVG width='2rem' height='2rem' />
						</button>
					</div>
				</div>

				<div className='gap-8 overflow-hidden pt-16 flex-column'>
					<div className='px-16 flex-justify-between'>
						<div onClick={onExpand} className='cursor-pointer gap-12 pl-16 flex-items-center'>
							<span className='select-none whitespace-nowrap rounded text-base text-gray-1000'>
								<span className='font-medium'>{selectedContracts.length} </span>
								{t('order_basket.selected_trade')}
							</span>
							<ArrowDownSVG
								width='1.4rem'
								height='1.4rem'
								style={{ transform: `rotate(${isMaximized ? 180 : 0}deg)` }}
								className='transition-transform'
							/>
						</div>

						<div className='flex h-40 gap-8 font-medium'>
							<button
								disabled={selectedContracts.length === 0}
								onClick={analyze}
								className='rounded px-16 btn-primary-outline'
								type='button'
							>
								{t('order_basket.analyze')}
							</button>

							<Button
								onClick={onSubmit}
								type='button'
								style={{ width: '9.6rem' }}
								className={clsx('rounded btn-primary', submitting && 'not')}
								disabled={selectedContracts.length === 0}
								loading={submitting}
							>
								{t('order_basket.trade')}
							</Button>
						</div>
					</div>

					{isMaximized && (
						<div style={{ maxHeight: '40rem' }} className='overflow-y-auto'>
							<SymbolStrategyTable
								selectedContracts={selectedContracts}
								contracts={basketOrders}
								onSelectionChanged={setSelectedContracts}
								onChangePrice={(id, value) => setOrderProperty(id, 'price', value)}
								onChangeQuantity={(id, value) => setOrderProperty(id, 'quantity', value)}
								onSideChange={(id, value) => setOrderProperty(id, 'side', value)}
								onDelete={removeOrder}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Basket;
