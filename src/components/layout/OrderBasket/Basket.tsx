import Button from '@/components/common/Button';
import { ArrowDownSVG, MaximizeSVG, MinimizeSVG, XSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setAnalyzeModal, setConfirmModal } from '@/features/slices/modalSlice';
import {
	getOrderBasket,
	removeOrderBasketOrder,
	setOrderBasket,
	setOrderBasketOrders,
} from '@/features/slices/userSlice';
import { useBasketOrderingSystem } from '@/hooks';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const SymbolStrategyTable = dynamic(() => import('@/components/common/Tables/SymbolStrategyTable'), {
	ssr: false,
	loading: () => (
		<div style={{ minHeight: '7.2rem' }} className='relative w-full flex-justify-center'>
			<div className='size-36 spinner' />
		</div>
	),
});

const Basket = () => {
	const t = useTranslations();

	const { baseSymbol, orders: basketOrders } = useAppSelector(getOrderBasket)!;

	const dispatch = useAppDispatch();

	const { submit, submitting } = useBasketOrderingSystem({
		onOrderRemoved: (item) => removeOrder(item.id),
		onOrdersSent: ({ failedOrders, sentOrders }) => {
			const failedOrdersLength = failedOrders.length;
			const sentOrdersLength = sentOrders.length;

			const message =
				failedOrdersLength === 0
					? 'alerts.orders_sent_successfully'
					: failedOrdersLength === sentOrdersLength
						? 'alerts.orders_sent_failed'
						: failedOrdersLength >= sentOrdersLength / 2
							? 'alerts.some_orders_sent_successfully'
							: 'alerts.most_orders_sent_successfully';

			toast.success(t(message));
		},
	});

	const [isMaximized, setIsMaximized] = useState(true);

	const [selectedContracts, setSelectedContracts] = useState<string[]>([]);

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

	const getSelectedContracts = () => {
		const result: OrderBasket.Order[] = [];

		for (let i = 0; i < selectedContracts.length; i++) {
			const orderId = selectedContracts[i];
			const order = basketOrders.find((order) => order.id === orderId);
			if (order) result.push(order);
		}

		return result;
	};

	const onClose = () => {
		if (basketOrders.length <= 1) close();
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

	const onSubmit = () => {
		submit(getSelectedContracts());
	};

	const removeOrder = (id: string) => {
		dispatch(removeOrderBasketOrder(id));
		setSelectedContracts((prev) => prev.filter((orderId) => orderId !== id));
	};

	const setOrderProperties = (id: string, values: Partial<Pick<TSymbolStrategy, 'price' | 'quantity' | 'side'>>) => {
		const orders = JSON.parse(JSON.stringify(basketOrders)) as OrderBasket.Order[];

		const orderIndex = orders.findIndex((item) => item.id === id);
		if (orderIndex === -1) return;

		orders[orderIndex] = {
			...orders[orderIndex],
			...values,
		};

		dispatch(setOrderBasketOrders(orders));
	};

	useEffect(() => {
		const lastItem = basketOrders[basketOrders.length - 1];
		if (!lastItem) return;

		if (selectedContracts.findIndex((orderId) => orderId === lastItem.id) > -1) return;

		setSelectedContracts([...selectedContracts, lastItem.id]);
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

				<div className='gap-8 overflow-hidden py-16 flex-column'>
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
								onChange={(id, v) => setOrderProperties(id, v)}
								onSideChange={(id, value) => setOrderProperties(id, { side: value })}
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
