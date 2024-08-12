import {
	useDraftOrdersQuery,
	useExecutedOrdersQuery,
	useOpenOrdersQuery,
	useOptionOrdersQuery,
	useTodayOrdersQuery,
} from '@/api/queries/brokerPrivateQueries';
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

	const { data: openOrdersData, isLoading: isLoadingOpenOrders } = useOpenOrdersQuery({
		queryKey: ['openOrdersQuery'],
		enabled: tab === 'open_orders',
	});

	const { data: todayOrdersData, isLoading: isLoadingTodayOrders } = useTodayOrdersQuery({
		queryKey: ['todayOrders'],
		enabled: tab === 'today_orders',
	});

	const { data: executedOrdersData, isLoading: isLoadingExecutedOrders } = useExecutedOrdersQuery({
		queryKey: ['executedOrdersQuery'],
		enabled: tab === 'executed_orders',
	});

	const { data: draftOrdersData, isLoading: isLoadingDraftOrders } = useDraftOrdersQuery({
		queryKey: ['draftOrdersQuery'],
		enabled: tab === 'draft',
	});

	const { data: optionOrdersData, isLoading: isLoadingOptionOrders } = useOptionOrdersQuery({
		queryKey: ['optionOrdersQuery'],
		enabled: tab === 'option_orders',
	});

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

	return (
		<div
			style={{ height: '36rem' }}
			className='relative flex-1 border-t border-t-gray-200 bg-white px-16 py-8 darkBlue:bg-gray-50 dark:bg-gray-50'
		>
			{tab === 'option_orders' ? (
				<OptionTable data={optionOrdersData ?? []} loading={isLoadingOptionOrders} />
			) : tab === 'draft' ? (
				<DraftTable
					setSelectedRows={setSelectedOrders}
					data={draftOrdersData ?? []}
					loading={isLoadingDraftOrders}
				/>
			) : (
				<OrderTable
					setSelectedRows={setSelectedOrders}
					{...ordersTableProps}
					loading={
						tab === 'executed_orders'
							? isLoadingExecutedOrders
							: tab === 'open_orders'
								? isLoadingOpenOrders
								: isLoadingTodayOrders
					}
				/>
			)}
		</div>
	);
};

export default Body;
