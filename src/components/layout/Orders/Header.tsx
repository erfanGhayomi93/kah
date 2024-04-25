import { useBrokerOrdersCountQuery } from '@/api/queries/brokerPrivateQueries';
import ipcMain from '@/classes/IpcMain';
import Tooltip from '@/components/common/Tooltip';
import { ArrowUpSVG, SendFillSVG, TrashFillSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setConfirmModal } from '@/features/slices/modalSlice';
import { getOrdersIsExpand, toggleOrdersIsExpand } from '@/features/slices/uiSlice';
import { cn, dateConverter } from '@/utils/helpers';
import { createOrders, deleteDraft, deleteOrder } from '@/utils/orders';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useLayoutEffect, useMemo, useState } from 'react';
import styles from './Orders.module.scss';

interface HeaderProps {
	isExpand: boolean;
	tab: TOrdersTab;
	setTab: (tav: TOrdersTab) => void;
}

const Header = ({ isExpand, tab, setTab }: HeaderProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const ordersIsExpand = useAppSelector(getOrdersIsExpand);

	const [selectedRows, setSelectedRows] = useState<Order.TOrder[]>([]);

	const { data: ordersCount } = useBrokerOrdersCountQuery({
		queryKey: ['brokerOrdersCountQuery'],
	});

	const tabs = useMemo<Array<{ id: TOrdersTab; title: string; count: number }>>(
		() => [
			{
				id: 'open_orders',
				title: t('orders.open_orders'),
				count: ordersCount?.openOrderCnt ?? 0,
			},
			{
				id: 'today_orders',
				title: t('orders.today_orders'),
				count: ordersCount?.todayOrderCnt ?? 0,
			},
			{
				id: 'executed_orders',
				title: t('orders.executed_orders'),
				count: ordersCount?.executedOrderCnt ?? 0,
			},
			{
				id: 'draft',
				title: t('orders.draft'),
				count: ordersCount?.orderDraftCnt ?? 0,
			},
			{
				id: 'option_orders',
				title: t('orders.option_orders'),
				count: ordersCount?.orderOptionCount ?? 0,
			},
		],
		[ordersCount],
	);

	const toggle = () => {
		dispatch(toggleOrdersIsExpand());
	};

	const onSelectTab = (tabId: TOrdersTab) => {
		setTab(tabId);
		if (!ordersIsExpand) toggle();
	};

	const onSelectRows = (orders: Order.TOrder[]) => {
		setSelectedRows(orders);
	};

	const deleteAll = (ids: number[]) => {
		if (tab === 'draft') deleteDraft(ids);
		else deleteOrder(ids);
	};

	const onDeleteAll = () => {
		if (selectedRows.length === 0) return;

		const ids = selectedRows.map((item) => ('orderId' in item ? item.orderId : item.id));

		dispatch(
			setConfirmModal({
				title: t(`orders.delete_${tab === 'draft' ? 'drafts' : 'orders'}`),
				description: t(`orders.delete_${tab === 'draft' ? 'drafts' : 'orders'}_confirm`),
				onSubmit: () => deleteAll(ids),
				confirm: {
					label: t('common.delete'),
					type: 'error',
				},
			}),
		);
	};

	const onSendAll = () => {
		if (tab !== 'draft' || selectedRows.length === 0) return;

		const orders: IpcMainChannels['send_orders'] = [];

		for (let i = 0; i < selectedRows.length; i++) {
			const draftOrder = selectedRows[i] as Order.DraftOrder;

			const params: IpcMainChannels['send_order'] = {
				symbolISIN: draftOrder.symbolISIN,
				quantity: draftOrder.quantity,
				price: draftOrder.price,
				orderSide: draftOrder.side === 'Buy' ? 'buy' : 'sell',
				validity: draftOrder.validity,
				validityDate: 0,
			};

			if (params.validity === 'GoodTillDate') params.validityDate = new Date(draftOrder.validityDate).getTime();
			else if (params.validity === 'Month' || params.validity === 'Week')
				params.validityDate = dateConverter(params.validity);

			orders.push(params);
		}

		createOrders(orders);

		const ids = selectedRows.map((item) => ('orderId' in item ? item.orderId : item.id));
		deleteAll(ids);

		ipcMain.send('deselect_orders', undefined);
		setSelectedRows([]);
	};

	useLayoutEffect(() => {
		const removeHandler = ipcMain.handle('set_selected_orders', onSelectRows);
		return () => removeHandler();
	}, []);

	useLayoutEffect(() => {
		setSelectedRows([]);
	}, [tab]);

	return (
		<div className='h-56 bg-white px-8 flex-justify-between'>
			<ul className='flex-1 flex-justify-start'>
				{tabs.map((order, index) => (
					<li key={index}>
						<button
							onClick={() => onSelectTab(order.id)}
							type='button'
							className={cn(
								'h-40 gap-10 rounded px-12 transition-colors flex-justify-center',
								tab === order.id ? 'bg-secondary-100 text-gray-1000' : 'text-gray-700',
							)}
						>
							{order.title}
							<span
								className={clsx(
									'h-22 min-w-22 rounded-oval text-tiny transition-colors flex-justify-center',
									tab === order.id ? 'bg-primary-400 text-white' : 'bg-gray-400 text-gray-700',
								)}
							>
								{order.count}
							</span>
						</button>
					</li>
				))}
			</ul>

			<ul className={styles.toolbar}>
				{isExpand && !['option_orders', 'executed_orders'].includes(tab) && (
					<>
						<li>
							<Tooltip content={t('tooltip.remove_all_selected_orders')}>
								<button onClick={onDeleteAll} disabled={selectedRows.length === 0} type='button'>
									<TrashFillSVG width='2rem' height='2rem' />
									{selectedRows.length > 0 && (
										<span className={styles.badge}>{selectedRows.length}</span>
									)}
								</button>
							</Tooltip>
						</li>
						{tab === 'draft' && (
							<li>
								<Tooltip content={t('tooltip.send_all_selected_orders')}>
									<button onClick={onSendAll} disabled={selectedRows.length === 0} type='button'>
										<SendFillSVG width='2rem' height='2rem' />
										{selectedRows.length > 0 && (
											<span className={styles.badge}>{selectedRows.length}</span>
										)}
									</button>
								</Tooltip>
							</li>
						)}
					</>
				)}

				<li>
					<button
						style={{ transform: `rotate(${ordersIsExpand ? 180 : 0}deg)` }}
						onClick={toggle}
						type='button'
					>
						<ArrowUpSVG width='1.6rem' height='1.6rem' />
					</button>
				</li>
			</ul>
		</div>
	);
};

export default Header;
