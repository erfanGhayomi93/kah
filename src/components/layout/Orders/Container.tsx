import ErrorBoundary from '@/components/common/ErrorBoundary';
import Loading from '@/components/common/Loading';
import { useAppSelector } from '@/features/hooks';
import { getOrdersIsExpand, getSidebarIsExpand } from '@/features/slices/uiSlice';
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
		ordersIsExpand: getOrdersIsExpand(state),
		sidebarIsExpand: getSidebarIsExpand(state),
	}),
);

const Container = () => {
	const { ordersIsExpand, sidebarIsExpand } = useAppSelector(getStates);

	const [activeTab, setActiveTab] = useLocalstorage<TOrdersTab>('ot', 'open_orders');

	return (
		<ErrorBoundary>
			<div className='relative h-56'>
				<div
					style={{
						height: ordersIsExpand ? '37.6rem' : '7.2rem',
						width: sidebarIsExpand ? 'calc(100% - 21.2rem)' : 'calc(100% - 5.6rem)',
						transition: 'height 250ms ease-in, width 300ms ease-in-out',
						bottom: '4rem',
					}}
					className='fixed left-0 rounded bg-gray-300 p-8'
				>
					<div className='size-full flex-column'>
						<div className='relative flex-1 overflow-hidden rounded bg-white shadow-tooltip flex-column'>
							<Header isExpand={ordersIsExpand} tab={activeTab} setTab={setActiveTab} />
							{ordersIsExpand && <Body tab={activeTab} />}
						</div>
					</div>
				</div>
			</div>
		</ErrorBoundary>
	);
};

export default Container;
