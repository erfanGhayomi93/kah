import { ArrowDownSVG, MaximizeSVG, MinimizeSVG, XSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setConfirmModal } from '@/features/slices/modalSlice';
import { getOrderBasket, setOrderBasket } from '@/features/slices/userSlice';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';

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

	const dispatch = useAppDispatch();

	const basket = useAppSelector(getOrderBasket);

	const [isMaximized, setIsMaximized] = useState(false);

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
						<div onClick={onExpand} className='flex-1 cursor-pointer gap-12 flex-items-center'>
							<span className='select-none whitespace-nowrap rounded text-base text-gray-1000'>
								<span className='font-medium'>{basket.length} </span>
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
							<button style={{ width: '9.6rem' }} className='rounded btn-primary' type='button'>
								{t('order_basket.trade')}
							</button>
						</div>
					</div>

					{isMaximized && <SelectedContracts data={basket} />}
				</div>
			</div>
		</div>
	);
};

export default Basket;
