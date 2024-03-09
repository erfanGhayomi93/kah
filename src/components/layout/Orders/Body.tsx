import {
	useDraftOrdersQuery,
	useExecutedOrdersQuery,
	useOpenOrdersQuery,
	useOptionOrdersQuery,
	useTodayOrdersQuery,
} from '@/api/queries/brokerPrivateQueries';
import Loading from '@/components/common/Loading';
import { useLayoutEffect, useMemo } from 'react';
import Table from './Table';

interface BodyProps {
	tab: TOrdersTab;
}

const Body = ({ tab }: BodyProps) => {
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

	const data = useMemo<
		Order.OpenOrder[] | Order.ExecutedOrder[] | Order.TodayOrder[] | Order.OptionOrder[] | Order.DraftOrder[]
	>(() => {
		switch (tab) {
			case 'open_orders':
				return openOrdersData ?? [];
			case 'draft':
				return draftOrdersData ?? [];
			case 'executed_orders':
				return executedOrdersData ?? [];
			case 'option_orders':
				return optionOrdersData ?? [];
			case 'today_orders':
				return todayOrdersData ?? [];
			default:
				return [];
		}
	}, [tab]);

	useLayoutEffect(() => {
		if (tab === 'open_orders') refetchOpenOrders();
		else if (tab === 'draft') refetchDraftOrders();
		else if (tab === 'executed_orders') refetchExecutedOrders();
		else if (tab === 'option_orders') refetchOptionOrders();
		else if (tab === 'today_orders') refetchTodayOrders();
	}, [tab]);

	return (
		<div style={{ height: '30rem' }} className='relative flex-1 border-t border-t-gray-500 bg-white'>
			<Table tab={tab} data={data} />

			{(isFetchingOpenOrders ||
				isFetchingTodayOrders ||
				isFetchingExecutedOrders ||
				isFetchingDraftOrders ||
				isFetchingOptionOrders) && <Loading />}
		</div>
	);
};

export default Body;
