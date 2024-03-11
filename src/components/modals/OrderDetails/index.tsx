import { XSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { toggleOrderDetailsModal, type IOrderDetailsModal } from '@/features/slices/modalSlice';
import { cn, dateFormatter, days, sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import styled from 'styled-components';
import Modal from '../Modal';

const Div = styled.div`
	width: 400px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

interface OrderDetailsProps extends IOrderDetailsModal {}

const OrderDetails = ({ order, ...props }: OrderDetailsProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const onCloseModal = () => {
		dispatch(toggleOrderDetailsModal(null));
	};

	const numFormatter = (v: number) => {
		return (
			<span className='text-tiny text-gray-900'>
				<span className='pl-4 text-base font-medium text-gray-1000'>{sepNumbers(String(v))}</span>
				{t('common.rial')}
			</span>
		);
	};

	const orderStatusColor = () => {
		switch (order.orderStatus) {
			case 'OrderDone':
			case 'OnBoard':
				return 'text-success-100 bg-success-100/10';
			case 'Error':
			case 'Canceled':
				return 'text-error-100 bg-error-100/10';
			case 'Modified':
				return 'text-secondary-300 bg-secondary-300/10';
			default:
				return 'text-gray-900 bg-gray-900/10';
		}
	};

	const validityDate = () => {
		const { validity, validityDate } = order;

		if (validity === 'GoodTillDate') {
			const tt = new Date(validityDate).getTime();
			const d = days(Date.now(), tt);

			if (d === 0) return t('validity_date.Today');
			if (d === 1) return t('validity_date.Tomorrow');

			return dateFormatter(tt, 'date');
		}

		return t(`validity_date.${validity}`);
	};

	const isBuy = order.orderSide === 'Buy';

	return (
		<Modal
			transparent
			moveable
			style={{ modal: { transform: 'translate(-50%, -50%)' } }}
			top='50%'
			onClose={onCloseModal}
			{...props}
		>
			<Div className='gap-8 bg-gray-100 flex-column'>
				<div className='relative h-56 w-full flex-justify-center'>
					<h2 className='text-xl font-medium text-gray-900'>
						{t('order_details.title', { title: order.symbolTitle })}
					</h2>
					<button onClick={onCloseModal} type='button' className='absolute left-16 icon-hover'>
						<XSVG width='2rem' height='2rem' />
					</button>
				</div>

				<div className='w-full gap-8 px-16 pb-16 flex-column'>
					<ul className='gap-24 rounded bg-white px-8 py-16 text-base shadow-card flex-column *:flex-justify-between'>
						<li>
							<span className='text-gray-900'>{t('order_details.order_side')}:</span>
							<span className={cn('font-medium', isBuy ? 'text-success-100' : 'text-error-100')}>
								{t(isBuy ? 'side.buy' : 'side.sell')}
							</span>
						</li>
						<li>
							<span className='text-gray-900'>{t('order_details.order_status')}:</span>
							<span
								style={{ maxWidth: '14.4rem' }}
								className={cn('truncate rounded px-8 py-4 text-right font-medium', orderStatusColor())}
							>
								{t(`order_status.${order.orderStatus}`)}
							</span>
						</li>
					</ul>

					<ul className='gap-24 rounded bg-white px-8 py-16 shadow-card flex-column *:flex-justify-between'>
						<li>
							<span className='text-gray-900'>{t('order_details.quantity_and_executed_orders')}:</span>
							<span className='text-tiny text-gray-900'>
								<span className='pl-4 text-base font-medium text-gray-1000'>{`(${sepNumbers(String(order.sumExecuted))}) / ${sepNumbers(String(order.quantity))}`}</span>
								{t('order_details.stock')}
							</span>
						</li>
						<li>
							<span className='text-gray-900'>{t('order_details.remain')}:</span>
							<span className='text-tiny text-gray-900'>
								<span className='pl-4 text-base font-medium text-gray-1000'>
									{sepNumbers(String(Math.max(0, order.quantity - order.sumExecuted) ?? 0))}
								</span>
								{t('order_details.stock')}
							</span>
						</li>
					</ul>

					<ul className='gap-24 rounded bg-white px-8 py-16 shadow-card flex-column *:flex-justify-between'>
						<li>
							<span className='text-gray-900'>{t('order_details.price')}:</span>
							{numFormatter(order.price)}
						</li>
						<li>
							<span className='text-gray-900'>{t('order_details.amount')}:</span>
							{numFormatter(order.orderVolume)}
						</li>
						<li>
							<span className='text-gray-900'>{t('order_details.commission')}:</span>
							{numFormatter(order.price * order.quantity - order.orderVolume)}
						</li>
						<li>
							<span className='text-gray-900'>{t('order_details.validity')}:</span>
							<span className='pl-4 text-base font-medium text-gray-1000'>{validityDate()}</span>
						</li>
					</ul>
				</div>
			</Div>
		</Modal>
	);
};

export default OrderDetails;
