import AnimatePresence from '@/components/common/animation/AnimatePresence';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Loading from '@/components/common/Loading';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getOrdersActiveTab, setOrdersActiveTab } from '@/features/slices/tabSlice';
import { getOrdersIsExpand } from '@/features/slices/uiSlice';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Header from './Header';

const Body = dynamic(() => import('./Body'), {
	ssr: false,
	loading: () => <Loading />,
});

const Container = () => {
	const ordersIsExpand = useAppSelector(getOrdersIsExpand);

	const activeTab = useAppSelector(getOrdersActiveTab);

	const dispatch = useAppDispatch();

	const [selectedOrders, setSelectedOrders] = useState<Order.TOrder[]>([]);

	return (
		<ErrorBoundary>
			<AnimatePresence initial={{ animation: 'expandOrders' }} exit={{ animation: 'collapseOrders' }}>
				{ordersIsExpand && (
					<div
						style={{
							transition: 'height 250ms ease-in, width 300ms ease-in-out',
							width: 'calc(100% - 6rem)',
							bottom: '4.8rem',
							zIndex: '9999',
						}}
						className='fixed left-0 w-full rounded bg-gray-300 py-8'
					>
						<div className='size-full flex-column'>
							<div className='relative flex-1 overflow-hidden rounded bg-white shadow-sm flex-column darkness:bg-gray-50'>
								<Header
									selectedOrders={selectedOrders}
									setSelectedOrders={setSelectedOrders}
									isExpand={ordersIsExpand}
									tab={activeTab}
									setTab={(v) => dispatch(setOrdersActiveTab(v))}
								/>
								{ordersIsExpand && <Body setSelectedOrders={setSelectedOrders} tab={activeTab} />}
							</div>
						</div>
					</div>
				)}
			</AnimatePresence>
		</ErrorBoundary>
	);
};

export default Container;
