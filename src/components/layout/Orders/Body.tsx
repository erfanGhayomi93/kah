import {
	useDraftOrdersQuery,
	useExecutedOrdersQuery,
	useOpenOrdersQuery,
	useOptionOrdersQuery,
	useTodayOrdersQuery,
} from '@/api/queries/brokerPrivateQueries';
import ipcMain from '@/classes/IpcMain';
import Loading from '@/components/common/Loading';
import { useQueryClient } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useLayoutEffect, useMemo } from 'react';

const OrderTable = dynamic(() => import('./Table/OrderTable'), {
	ssr: false,
	loading: () => <Loading />,
});

const DraftTable = dynamic(() => import('./Table/DraftTable'), {
	ssr: false,
	loading: () => <Loading />,
});

const OptionTable = dynamic(() => import('./Table/OptionTable'), {
	ssr: false,
	loading: () => <Loading />,
});

interface BodyProps {
	tab: TOrdersTab;
}

const Body = ({ tab }: BodyProps) => {
	const queryClient = useQueryClient();

	const {
		data: openOrdersData,
		refetch: refetchOpenOrders,
		isFetching: isFetchingOpenOrders,
	} = useOpenOrdersQuery({
		queryKey: ['openOrdersQuery'],
		enabled: false,
	});

	const {
		data: todayOrdersData,
		refetch: refetchTodayOrders,
		isFetching: isFetchingTodayOrders,
	} = useTodayOrdersQuery({
		queryKey: ['openOrdersQuery'],
		enabled: false,
	});

	const {
		data: executedOrdersData,
		refetch: refetchExecutedOrders,
		isFetching: isFetchingExecutedOrders,
	} = useExecutedOrdersQuery({
		queryKey: ['executedOrdersQuery'],
		enabled: false,
	});

	const {
		data: draftOrdersData,
		refetch: refetchDraftOrders,
		isFetching: isFetchingDraftOrders,
	} = useDraftOrdersQuery({
		queryKey: ['draftOrdersQuery'],
		enabled: false,
	});

	const {
		data: optionOrdersData,
		refetch: refetchOptionOrders,
		isFetching: isFetchingOptionOrders,
	} = useOptionOrdersQuery({
		queryKey: ['optionOrdersQuery'],
		enabled: false,
	});

	const refetchActiveTab = () => {
		if (tab === 'open_orders') refetchOpenOrders();
		else if (tab === 'draft') refetchDraftOrders();
		else if (tab === 'executed_orders') refetchExecutedOrders();
		else if (tab === 'option_orders') refetchOptionOrders();
		else if (tab === 'today_orders') refetchTodayOrders();
	};

	const updateOrdersCount = (data: Partial<Broker.OrdersCount>) => {
		const queryKey = ['brokerOrdersCountQuery'];
		const cache = queryClient.getQueryData(queryKey) ?? {
			openOrderCnt: 0,
			todayOrderCnt: 0,
			executedOrderCnt: 0,
			orderDraftCnt: 0,
			orderOptionCount: 0,
		};

		queryClient.setQueryData(['brokerOrdersCountQuery'], { ...cache, ...data });
	};

	const setSelectedRows = (orders: Order.TOrder[]) => {
		if (Array.isArray(orders)) ipcMain.send('set_selected_orders', orders);
	};

	const ordersData = useMemo<Order.OpenOrder[] | Order.ExecutedOrder[] | Order.TodayOrder[]>(() => {
		switch (tab) {
			case 'open_orders':
				return openOrdersData ?? [];
			case 'executed_orders':
				return executedOrdersData ?? [];
			case 'today_orders':
				return todayOrdersData ?? [];
			default:
				return [];
		}
	}, [tab, openOrdersData, draftOrdersData, executedOrdersData, todayOrdersData]);

	useLayoutEffect(() => {
		switch (tab) {
			case 'draft':
				if (Array.isArray(draftOrdersData)) updateOrdersCount({ orderDraftCnt: draftOrdersData.length });
				break;
			case 'executed_orders':
				if (Array.isArray(executedOrdersData))
					updateOrdersCount({ executedOrderCnt: executedOrdersData.length });
				break;
			case 'open_orders':
				if (Array.isArray(openOrdersData)) updateOrdersCount({ openOrderCnt: openOrdersData.length });
				break;
			case 'option_orders':
				if (Array.isArray(optionOrdersData)) updateOrdersCount({ orderOptionCount: optionOrdersData.length });
				break;
			case 'today_orders':
				if (Array.isArray(todayOrdersData)) updateOrdersCount({ todayOrderCnt: todayOrdersData.length });
				break;
		}
	}, [tab, openOrdersData, todayOrdersData, executedOrdersData, draftOrdersData, optionOrdersData]);

	useLayoutEffect(() => {
		const removeHandler = ipcMain.handle('refetch_active_order_tab', refetchActiveTab);
		return () => removeHandler();
	}, [tab]);

	useLayoutEffect(() => {
		if (tab === 'open_orders') refetchOpenOrders();
		else if (tab === 'draft') refetchDraftOrders();
		else if (tab === 'executed_orders') refetchExecutedOrders();
		else if (tab === 'option_orders') refetchOptionOrders();
		else if (tab === 'today_orders') refetchTodayOrders();
	}, [tab]);

	return (
		<div style={{ height: '36rem' }} className='relative flex-1 border-t border-t-gray-500 bg-white px-16 py-8'>
			{tab === 'option_orders' ? (
				<OptionTable data={optionOrdersData ?? []} loading={isFetchingOptionOrders} />
			) : tab === 'draft' ? (
				<DraftTable
					setSelectedRows={setSelectedRows}
					data={draftOrdersData ?? []}
					loading={isFetchingDraftOrders}
				/>
			) : (
				<OrderTable
					setSelectedRows={setSelectedRows}
					tab={tab}
					data={ordersData}
					loading={
						tab === 'executed_orders'
							? isFetchingExecutedOrders
							: tab === 'open_orders'
								? isFetchingOpenOrders
								: isFetchingTodayOrders
					}
				/>
			)}
		</div>
	);
};

export default Body;
