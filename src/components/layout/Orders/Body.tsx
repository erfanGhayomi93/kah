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
import { useEffect, useMemo } from 'react';
import { type ExecutedOrderProps, type OpenOrderProps, type TodayOrderProps } from './Table/OrderTable';

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
	setSelectedOrders: (orders: Order.TOrder[]) => void;
}

const Body = ({ tab, setSelectedOrders }: BodyProps) => {
	const queryClient = useQueryClient();

	const {
		data: openOrdersData,
		refetch: refetchOpenOrders,
		isLoading: isFetchingOpenOrders,
	} = useOpenOrdersQuery({
		queryKey: ['openOrdersQuery'],
		enabled: false,
	});

	const {
		data: todayOrdersData,
		refetch: refetchTodayOrders,
		isLoading: isFetchingTodayOrders,
	} = useTodayOrdersQuery({
		queryKey: ['openOrdersQuery'],
		enabled: false,
	});

	const {
		data: executedOrdersData,
		refetch: refetchExecutedOrders,
		isLoading: isFetchingExecutedOrders,
	} = useExecutedOrdersQuery({
		queryKey: ['executedOrdersQuery'],
		enabled: false,
	});

	const {
		data: draftOrdersData,
		refetch: refetchDraftOrders,
		isLoading: isFetchingDraftOrders,
	} = useDraftOrdersQuery({
		queryKey: ['draftOrdersQuery'],
		enabled: false,
	});

	const {
		data: optionOrdersData,
		refetch: refetchOptionOrders,
		isLoading: isFetchingOptionOrders,
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
		const cache = queryClient.getQueryData(queryKey);

		if (cache) queryClient.setQueryData(['brokerOrdersCountQuery'], { ...cache, ...data });
	};

	const ordersTableProps = useMemo<OpenOrderProps | ExecutedOrderProps | TodayOrderProps>(() => {
		if (tab === 'open_orders') return { tab: 'open_orders', data: openOrdersData ?? [] };
		if (tab === 'executed_orders') return { tab: 'executed_orders', data: executedOrdersData ?? [] };

		return { tab: 'today_orders', data: todayOrdersData ?? [] };
	}, [tab, openOrdersData, draftOrdersData, executedOrdersData, todayOrdersData]);

	useEffect(() => {
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

	useEffect(() => {
		const removeHandler = ipcMain.handle('refetch_active_order_tab', refetchActiveTab);
		return () => removeHandler();
	}, [tab]);

	useEffect(() => {
		if (tab === 'open_orders') refetchOpenOrders();
		else if (tab === 'draft') refetchDraftOrders();
		else if (tab === 'executed_orders') refetchExecutedOrders();
		else if (tab === 'option_orders') refetchOptionOrders();
		else if (tab === 'today_orders') refetchTodayOrders();
	}, [tab]);

	return (
		<div
			style={{ height: '36rem' }}
			className='relative flex-1 border-t border-t-light-gray-200 bg-white px-16 py-8'
		>
			{tab === 'option_orders' ? (
				<OptionTable data={optionOrdersData ?? []} loading={isFetchingOptionOrders} />
			) : tab === 'draft' ? (
				<DraftTable
					setSelectedRows={setSelectedOrders}
					data={draftOrdersData ?? []}
					loading={isFetchingDraftOrders}
				/>
			) : (
				<OrderTable
					setSelectedRows={setSelectedOrders}
					{...ordersTableProps}
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
