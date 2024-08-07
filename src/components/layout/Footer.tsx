import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getLsStatus, getOrdersIsExpand, setOrdersIsExpand } from '@/features/slices/uiSlice';
import { getBrokerIsSelected, getIsLoggedIn } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { cn } from '@/utils/helpers';
import { createSelector } from '@reduxjs/toolkit';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { ArrowDownSVG } from '../icons';
import Orders from './Orders';

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		isLoggedIn: getIsLoggedIn(state) && getBrokerIsSelected(state),
		lsStatus: getLsStatus(state),
		ordersIsExpand: getOrdersIsExpand(state),
	}),
);

const WifiSVG = ({ full }: { full: boolean }) => (
	<svg width='2.4rem' height='2.4rem' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
		<path
			d='M12.0008 17.9998H12.0108M9.17275 15.1718C9.92286 14.4219 10.9401 14.0007 12.0008 14.0007C13.0614 14.0007 14.0786 14.4219 14.8288 15.1718M6.34375 12.3428C7.08662 11.5999 7.96856 11.0106 8.93919 10.6085C9.90982 10.2065 10.9501 9.99951 12.0008 9.99951C13.0514 9.99951 14.0917 10.2065 15.0623 10.6085C16.0329 11.0106 16.9149 11.5999 17.6577 12.3428'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
		{full && (
			<path
				d='M3.51562 9.51476C8.20162 4.82776 15.7996 4.82776 20.5156 9.51476'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
		)}
	</svg>
);

const Footer = () => {
	const t = useTranslations('footer');

	const dispatch = useAppDispatch();

	const { isLoggedIn, lsStatus, ordersIsExpand } = useAppSelector(getStates);

	return (
		<div className='h-56 flex-column'>
			<Orders />

			<footer className='z-10 h-56 pt-8'>
				<div className='h-48 bg-white pl-24 flex-justify-between darkness:bg-gray-50'>
					<div className='h-full pr-16 flex-justify-start'>
						{isLoggedIn ? (
							<button
								type='button'
								onClick={() => dispatch(setOrdersIsExpand(!ordersIsExpand))}
								className={clsx(
									'h-32 gap-8 rounded px-16 text-base text-gray-800 transition-colors flex-justify-center',
									ordersIsExpand ? 'bg-secondary-200' : 'bg-gray-300',
								)}
							>
								{t('orders')}
								<ArrowDownSVG
									style={{ transform: ordersIsExpand ? 'rotate(180deg)' : undefined }}
									className='text-gray-700 transition-transform'
								/>
							</button>
						) : (
							<a
								target='_blank'
								href='https://ramandtech.com/'
								className='text-tiny font-normal text-gray-800 transition-colors hover:text-secondary-300'
							>
								{t('copyright')}
							</a>
						)}
					</div>

					<div style={{ gap: '2.8rem' }} className='h-full flex-justify-end'>
						<span
							className={cn(
								'flex items-center gap-8 transition-colors',
								lsStatus === 'CONNECTING'
									? 'text-warning-100'
									: lsStatus === 'DISCONNECTED'
										? 'text-error-100'
										: 'text-success-100',
							)}
						>
							<WifiSVG full={!(lsStatus === 'CONNECTING' || lsStatus === 'DISCONNECTED')} />
						</span>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Footer;
