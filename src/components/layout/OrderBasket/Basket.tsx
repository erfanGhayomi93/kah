import { ArrowDownSVG, MaximizeSVG, XSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setConfirmModal } from '@/features/slices/modalSlice';
import { getOrderBasket, setOrderBasket } from '@/features/slices/userSlice';
import { useTranslations } from 'next-intl';

const Basket = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const basket = useAppSelector(getOrderBasket);

	const onClose = () => {
		dispatch(
			setConfirmModal({
				title: t('order_basket.delete_order_basket'),
				description: t('order_basket.empty_order_basket'),
				onSubmit: () => dispatch(setOrderBasket([])),
				confirm: {
					label: t('common.delete'),
					type: 'error',
				},
			}),
		);
	};

	return (
		<div style={{ right: '6.4rem', minWidth: '41.6rem', zIndex: 99 }} className='fixed bottom-8'>
			<div className='overflow-hidden rounded bg-white shadow-card'>
				<div className='relative h-56 w-full bg-gray-200 flex-justify-center'>
					<h2 className='text-xl font-medium'>{t('order_basket.title')}</h2>

					<div className='absolute left-24 gap-16 flex-items-center'>
						<button type='button' className='icon-hover'>
							<MaximizeSVG width='1.6rem' height='1.6rem' />
						</button>

						<button onClick={onClose} type='button' className='icon-hover'>
							<XSVG width='2rem' height='2rem' />
						</button>
					</div>
				</div>
				<div className='p-16 flex-justify-between'>
					<div className='flex-1 gap-16 flex-items-center'>
						<span className='select-none whitespace-nowrap rounded text-base text-gray-1000'>
							{t('order_basket.selected_trade', { n: basket.length })}
						</span>
						<ArrowDownSVG width='1.4rem' height='1.4rem' />
					</div>

					<div className='flex h-40 gap-8 font-medium'>
						<button className='rounded px-16 btn-primary-outline' type='button'>
							{t('order_basket.analyze')}
						</button>
						<button style={{ width: '9.6rem' }} className='rounded btn-primary' type='button'>
							{t('order_basket.trade')}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Basket;
