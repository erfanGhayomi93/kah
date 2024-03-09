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

const OrderTable = dynamic(() => import('./OrderTable'), {
	ssr: false,
	loading: () => <Loading />,
});

const DraftTable = dynamic(() => import('./DraftTable'), {
	ssr: false,
	loading: () => <Loading />,
});

const OptionTable = dynamic(() => import('./OptionTable'), {
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
		ipcMain.handle('refetch_active_order_tab', refetchActiveTab);

		return () => {
			ipcMain.removeHandler('refetch_active_order_tab', refetchActiveTab);
		};
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
				<OptionTable data={optionOrdersData ?? []} />
			) : tab === 'draft' ? (
				<DraftTable data={draftOrdersData ?? []} />
			) : (
				<OrderTable tab={tab} data={ordersData} />
			)}

			{(isFetchingOpenOrders ||
				isFetchingTodayOrders ||
				isFetchingExecutedOrders ||
				isFetchingDraftOrders ||
				isFetchingOptionOrders) && <Loading />}
		</div>
	);
};

export default Body;
