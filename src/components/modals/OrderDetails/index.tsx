import { XSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setOrderDetailsModal } from '@/features/slices/modalSlice';
import { type TOrderDetailsModal } from '@/features/slices/modalSlice.interfaces';
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
			<span className='text-tiny text-gray-900'>
				<span className='pl-4 text-base font-medium text-gray-1000'>{sepNumbers(String(v))}</span>
				{t('common.rial')}
			</span>
		);
	};

	const orderStatusColor = () => {
		if (type === 'option') return '';

		switch (data.orderStatus) {
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
		if (type === 'option') return '';

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
		const isBuy = type === 'option' ? data.side : data.orderSide === 'Buy';

		if (type === 'order')
			return [
				[
					{
						name: t('order_details_modal.order_side'),
						value: t(isBuy ? 'side.buy' : 'side.sell'),
						className: isBuy ? 'text-success-100' : 'text-error-100',
					},
					{
						name: t('order_details_modal.order_status'),
						value: t(`order_status.${data.orderStatus}`),
						className: ['truncate rounded px-8 py-4 text-right', orderStatusColor()],
					},
				],
				[
					{
						name: t('order_details_modal.quantity_and_executed_orders'),
						value: (
							<>
								<span className='pl-4 font-medium'>{`(${sepNumbers(String(data.sumExecuted))}) / ${sepNumbers(String(data.quantity))}`}</span>
								<span className='text-tiny text-gray-900'>{t('order_details_modal.stock')}</span>
							</>
						),
					},
					{
						name: t('order_details_modal.remain'),
						value: (
							<>
								<span className='pl-4 font-medium'>
									{sepNumbers(String(Math.max(0, data.quantity - data.sumExecuted) ?? 0))}
								</span>
								<span className='text-tiny text-gray-900'>{t('order_details_modal.stock')}</span>
							</>
						),
					},
				],
				[
					{ name: t('order_details_modal.price'), value: numFormatter(data.price) },
					{ name: t('order_details_modal.amount'), value: numFormatter(data.orderVolume) },
					{
						name: t('order_details_modal.commission'),
						value: numFormatter(data.orderVolume - data.price * data.quantity),
					},
					{
						name: t('order_details_modal.validity'),
						value: <span className='pl-4 font-medium'>{validityDate()}</span>,
					},
				],
			];

		return [
			[
				{
					name: t('order_details_modal.order_side'),
					value: t(isBuy ? 'side.buy' : 'side.sell'),
					className: isBuy ? 'text-success-100' : 'text-error-100',
				},
				{
					name: t('order_details_modal.symbol'),
					value: data.symbolTitle,
				},
				{
					name: t('order_details_modal.type'),
					value: t(`order_details_modal.${data.type}`),
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
			<Div className='gap-8 bg-gray-100 flex-column'>
				<div className='relative h-56 w-full flex-justify-center'>
					<h2 className='text-xl font-medium text-gray-900'>
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
									<span className='text-gray-900'>{item.name}:</span>
									<span className={clsx('text-base font-medium text-gray-1000', item.className)}>
										{item.value}
									</span>
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
