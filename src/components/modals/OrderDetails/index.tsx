import { XSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setOrderDetailsModal } from '@/features/slices/modalSlice';
import { type TOrderDetailsModal } from '@/features/slices/types/modalSlice.interfaces';
import dayjs from '@/libs/dayjs';
import { dateFormatter, days, sepNumbers, toFixed } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { forwardRef, useMemo } from 'react';
import styled from 'styled-components';
import Modal from '../Modal';

const Div = styled.div`
	width: 400px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

interface IItem {
	name: string;
	value: React.ReactNode;
	className?: ClassesValue;
}

const OrderDetails = forwardRef<HTMLDivElement, TOrderDetailsModal>(({ type, data, ...props }, ref) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const onCloseModal = () => {
		dispatch(setOrderDetailsModal(null));
	};

	const numFormatter = (v: number) => {
		return (
			<span className='text-tiny text-light-gray-700'>
				<span className='pl-4 text-base font-medium text-light-gray-800'>{sepNumbers(String(v))}</span>
				{t('common.rial')}
			</span>
		);
	};

	const orderStatusColor = () => {
		if (!('orderStatus' in data)) return '';

		switch (data.orderStatus) {
			case 'OrderDone':
			case 'OnBoard':
				return 'text-light-success-100 bg-light-success-50';
			case 'Error':
			case 'Canceled':
				return 'text-light-error-100 bg-light-error-50';
			case 'Modified':
				return 'text-light-secondary-300 bg-light-secondary-300/10';
			default:
				return 'text-light-gray-700 bg-light-gray-700/10';
		}
	};

	const validityDate = () => {
		if (!('validity' in data) || !('validityDate' in data)) return '';

		const { validity, validityDate } = data;

		if (validity === 'GoodTillDate') {
			const tt = new Date(validityDate).getTime();
			const d = days(Date.now(), tt);

			if (d === 0) return t('validity_date.Today');
			if (d === 1) return t('validity_date.Tomorrow');

			return dateFormatter(tt, 'date');
		}

		return t(`validity_date.${validity}`);
	};

	const list = useMemo<IItem[][]>(() => {
		const price = 'price' in data ? data.price : data.tradePrice;
		const amount = 'orderVolume' in data ? data.orderVolume : 'totalPrice' in data ? data.totalPrice : 0;
		const quantity = 'quantity' in data ? data.quantity : data.tradeQuantity;
		const orderStatus = 'orderStatus' in data ? data.orderStatus : 'OrderDone';
		const sumExecuted = 'sumExecuted' in data ? data.sumExecuted : quantity;
		const side = (type === 'order' ? data.orderSide : data.side).toLowerCase();
		const isBuy = side === 'buy';

		if (type === 'order')
			return [
				[
					{
						name: t('order_details_modal.order_side'),
						value: t(isBuy ? 'side.buy' : 'side.sell'),
						className: isBuy ? 'text-light-success-100' : 'text-light-error-100',
					},
					{
						name: t('order_details_modal.order_status'),
						value: t(`order_status.${orderStatus}`),
						className: ['truncate rounded px-8 py-4 text-right', orderStatusColor()],
					},
				],
				[
					{
						name: t('order_details_modal.quantity_and_executed_orders'),
						value: (
							<>
								<span className='pl-4 font-medium'>{`(${sepNumbers(String(sumExecuted))}) / ${sepNumbers(String(quantity))}`}</span>
								<span className='text-tiny text-light-gray-700'>{t('order_details_modal.stock')}</span>
							</>
						),
					},
					{
						name: t('order_details_modal.remain'),
						value: (
							<>
								<span className='pl-4 font-medium'>
									{sepNumbers(String(Math.max(0, quantity - sumExecuted)))}
								</span>
								<span className='text-tiny text-light-gray-700'>{t('order_details_modal.stock')}</span>
							</>
						),
					},
				],
				[
					{ name: t('order_details_modal.price'), value: numFormatter(price) },
					{ name: t('order_details_modal.amount'), value: numFormatter(amount) },
					{
						name: t('order_details_modal.commission'),
						value: numFormatter(amount - price * quantity),
					},
					{
						name: t('order_details_modal.validity'),
						value: <span className='pl-4 font-medium'>{validityDate()}</span>,
					},
				],
			];

		if (type === 'base')
			return [
				[
					{
						name: t('order_details_modal.symbol'),
						value: data.symbolTitle,
					},
					{
						name: t('order_details_modal.order_side'),
						value: t(isBuy ? 'side.buy' : 'side.sell'),
						className: isBuy ? 'text-light-success-100' : 'text-light-error-100',
					},
					{ name: t('order_details_modal.price'), value: numFormatter(data.price) },
					{ name: t('order_details_modal.quantity'), value: numFormatter(data.quantity) },
				],
			];

		return [
			[
				{
					name: t('order_details_modal.order_side'),
					value: t(isBuy ? 'side.buy' : 'side.sell'),
					className: isBuy ? 'text-light-success-100' : 'text-light-error-100',
				},
				{
					name: t('order_details_modal.symbol'),
					value: data.symbolTitle,
				},
				{
					name: t('order_details_modal.type'),
					value: t(`order_details_modal.${data.type}`),
					className: data.type === 'call' ? 'text-light-success-100' : 'text-light-error-100',
				},
				{
					name: t('order_details_modal.end_date'),
					value: dayjs(data.settlementDay).calendar('jalali').format('YYYY/MM/DD'),
				},
				{
					name: t('order_details_modal.strike_price'),
					value: sepNumbers(String(data.strikePrice)),
				},
				{
					name: t('order_details_modal.contract_size'),
					value: sepNumbers(String(data.contractSize)),
				},
				{
					name: t('order_details_modal.required_margin'),
					value: sepNumbers(String(data.requiredMargin)),
				},
				{
					name: t('order_details_modal.trade_commission'),
					value: toFixed(data.tradeCommission, 4),
				},
				{
					name: t('order_details_modal.strike_commission'),
					value: toFixed(data.strikeCommission, 4),
				},
			],
		];
	}, [data]);

	return (
		<Modal
			transparent
			moveable
			style={{ modal: { transform: 'translate(-50%, -50%)' } }}
			top='50%'
			onClose={onCloseModal}
			{...props}
			ref={ref}
		>
			<Div className='gap-8 bg-light-gray-50 flex-column'>
				<div className='relative h-56 w-full flex-justify-center'>
					<h2 className='text-xl font-medium text-light-gray-700'>
						{t('order_details_modal.title', { title: data.symbolTitle })}
					</h2>
					<button onClick={onCloseModal} type='button' className='absolute left-16 icon-hover'>
						<XSVG width='2rem' height='2rem' />
					</button>
				</div>

				<div className='w-full gap-8 px-16 pb-16 flex-column'>
					{list.map((items, i) => (
						<ul
							key={i}
							className='gap-24 rounded bg-white px-8 py-16 text-base shadow-card flex-column *:flex-justify-between'
						>
							{items.map((item, j) => (
								<li key={j}>
									<span className='text-light-gray-700'>{item.name}:</span>
									<span className={clsx('text-base font-medium', item.className)}>{item.value}</span>
								</li>
							))}
						</ul>
					))}
				</div>
			</Div>
		</Modal>
	);
});

export default OrderDetails;
