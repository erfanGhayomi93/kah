import AnimatePresence from '@/components/common/animation/AnimatePresence';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import Loading from '@/components/common/Loading';
import { useAppSelector } from '@/features/hooks';
import { getOrdersIsExpand } from '@/features/slices/uiSlice';
import { useLocalstorage } from '@/hooks';
import dynamic from 'next/dynamic';
import Header from './Header';

const Body = dynamic(() => import('./Body'), {
	ssr: false,
	loading: () => <Loading />,
});

const Container = () => {
	const ordersIsExpand = useAppSelector(getOrdersIsExpand);

	const [activeTab, setActiveTab] = useLocalstorage<TOrdersTab>('ot', 'open_orders');

	return (
		<ErrorBoundary>
			<AnimatePresence initial={{ animation: 'expandOrders' }} exit={{ animation: 'collapseOrders' }}>
				{ordersIsExpand && (
					<div
						style={{
							transition: 'height 250ms ease-in, width 300ms ease-in-out',
							width: 'calc(100% - 6rem)',
							bottom: '4.8rem',
						}}
						className='fixed left-0 w-full rounded bg-gray-300 py-8'
					>
						<div className='size-full flex-column'>
							<div className='relative flex-1 overflow-hidden rounded bg-white shadow-tooltip flex-column'>
								<Header isExpand={ordersIsExpand} tab={activeTab} setTab={setActiveTab} />
								{ordersIsExpand && <Body tab={activeTab} />}
							</div>
						</div>
					</div>
				)}
			</AnimatePresence>
		</ErrorBoundary>
	);
};

export default Container;
