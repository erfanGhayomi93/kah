import ipcMain from '@/classes/IpcMain';
import Button from '@/components/common/Button';
import { ArrowDownSVG, MaximizeSVG, MinimizeSVG, XSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setChoiceBrokerModal, setConfirmModal, setLoginModal } from '@/features/slices/modalSlice';
import { getOrderBasket, setBrokerIsSelected, setOrderBasket } from '@/features/slices/userSlice';
import { getBrokerClientId, getClientId } from '@/utils/cookie';
import { createOrder } from '@/utils/orders';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useLayoutEffect, useRef, useState } from 'react';

const SelectedContracts = dynamic(() => import('./SelectedContracts'), {
	ssr: false,
	loading: () => (
		<div style={{ minHeight: '7.2rem' }} className='relative w-full flex-justify-center'>
			<div className='size-36 spinner' />
		</div>
	),
});

const Basket = () => {
	const t = useTranslations();

	const sendingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const basketSnapshot = useRef<IOrderBasket[]>([]);

	const dispatch = useAppDispatch();

	const basket = useAppSelector(getOrderBasket);

	const [submitting, setSubmitting] = useState(false);

	const [isMaximized, setIsMaximized] = useState(false);

	const [selectedContracts, setSelectedContracts] = useState<IOrderBasket[]>([]);

	const close = () => {
		dispatch(setOrderBasket([]));
	};

	const onClose = () => {
		if (basket.length === 1) close();
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

	const removeFromBasket = (itemId: string) => {
		let data = [...basketSnapshot.current];
		data = data.filter((item) => item.id !== itemId);

		basketSnapshot.current = data;

		dispatch(setOrderBasket(data));
		setSelectedContracts((prev) => prev.filter((item) => item.id !== itemId));
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

		try {
			validation();

			basketSnapshot.current = JSON.parse(JSON.stringify(basket)) as typeof basket;

			setSubmitting(true);
			sendOrder(0);
		} catch (e) {
			console.error(e);
		}
	};

	const onOrderMessageReceived = (item: IOrderBasket, id: string) => (result: IpcMainChannels['order_sent']) => {
		if (id !== result.id) return;
		removeFromBasket(item.id);
	};

	const onOrderSentSuccessfully = (item: IOrderBasket) => {
		//
	};

	const sendOrder = async (index: number) => {
		try {
			const item = selectedContracts[index];
			if (!item) throw new Error('Item not found!');

			if (!item.symbolISIN) throw new Error('symbolISIN not found!');

			const uuid = await createOrder({
				symbolISIN: item.symbolISIN,
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

	const addNewHandler = (item: IOrderBasket, id: string) => {
		const removeHandler = ipcMain.handle('order_sent', onOrderMessageReceived(item, id), { once: true });

		if (sendingTimeoutRef.current) clearTimeout(sendingTimeoutRef.current);

		sendingTimeoutRef.current = setTimeout(() => {
			onOrderSentSuccessfully(item);
			removeHandler();
		}, 2000);
	};

	useLayoutEffect(() => {
		const lastItem = basket[basket.length - 1];
		if (lastItem.symbolISIN === null) return;

		if (selectedContracts.findIndex((item) => item.id === lastItem.id) > -1) return;

		setSelectedContracts([...selectedContracts, lastItem]);
	}, [basket.length]);

	return (
		<div
			style={{
				right: '6.4rem',
				width: isMaximized ? '60.8rem' : '41.6rem',
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

				<div className='gap-24 overflow-hidden py-16 flex-column'>
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
							<button disabled className='rounded px-16 btn-primary-outline' type='button'>
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
						<SelectedContracts
							data={basket}
							selectedData={selectedContracts}
							setSelectedData={setSelectedContracts}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default Basket;
