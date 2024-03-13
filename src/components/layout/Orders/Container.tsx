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

export default Container;
