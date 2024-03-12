import ErrorBoundary from '@/components/common/ErrorBoundary';
import Loading from '@/components/common/Loading';
import { useAppSelector } from '@/features/hooks';
import { getOrdersIsExpand } from '@/features/slices/uiSlice';
import { getBrokerIsSelected, getIsLoggedIn } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { useLocalstorage } from '@/hooks';
import { createSelector } from '@reduxjs/toolkit';
import dynamic from 'next/dynamic';
import Header from './Header';

const Body = dynamic(() => import('./Body'), {
	ssr: false,
	loading: () => <Loading />,
});

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		isLoggedIn: getIsLoggedIn(state) && getBrokerIsSelected(state),
		ordersIsExpand: getOrdersIsExpand(state),
	}),
);

const Orders = () => {
	const { isLoggedIn, ordersIsExpand } = useAppSelector(getStates);

	const [activeTab, setActiveTab] = useLocalstorage<TOrdersTab>('ot', 'open_orders');

	if (!isLoggedIn) return null;

	return (
		<ErrorBoundary>
			<div className='relative'>
				<div className='h-56' />

				<div
					className='absolute bottom-0 left-0 w-full pl-8 flex-column'
					style={{
						transition: 'height 250ms ease-in',
						height: ordersIsExpand ? '36rem' : '5.6rem',
					}}
				>
					<div className='relative flex-1 overflow-hidden rounded bg-white shadow-tooltip flex-column'>
						<Header isExpand={ordersIsExpand} tab={activeTab} setTab={setActiveTab} />
						{ordersIsExpand && <Body tab={activeTab} />}
					</div>
				</div>
			</div>
		</ErrorBoundary>
	);
};

export default Orders;
