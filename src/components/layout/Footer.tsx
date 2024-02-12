import { useAppSelector } from '@/features/hooks';
import { getLsStatus } from '@/features/slices/uiSlice';
import { useServerDatetime } from '@/hooks';
import dayjs from '@/libs/dayjs';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

const WifiSVG = ({ full }: { full: boolean }) => (
	<svg width='2.4rem' height='2.4rem' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
		<path
			d='M12.0008 17.9998H12.0108M9.17275 15.1718C9.92286 14.4219 10.9401 14.0007 12.0008 14.0007C13.0614 14.0007 14.0786 14.4219 14.8288 15.1718M6.34375 12.3428C7.08662 11.5999 7.96856 11.0106 8.93919 10.6085C9.90982 10.2065 10.9501 9.99951 12.0008 9.99951C13.0514 9.99951 14.0917 10.2065 15.0623 10.6085C16.0329 11.0106 16.9149 11.5999 17.6577 12.3428'
			stroke='currentColor'
			stroke-width='2'
			stroke-linecap='round'
			stroke-linejoin='round'
		/>
		{full && (
			<path
				d='M3.51562 9.51476C8.20162 4.82776 15.7996 4.82776 20.5156 9.51476'
				stroke='currentColor'
				stroke-width='2'
				stroke-linecap='round'
				stroke-linejoin='round'
			/>
		)}
	</svg>
);

const Footer = () => {
	const t = useTranslations();

	const { timestamp } = useServerDatetime();

	const lsStatus = useAppSelector(getLsStatus);

	const [serverTime, serverDate] = useMemo(() => {
		return dayjs(timestamp).calendar('jalali').format('HH:mm:ss YYYY/MM/DD').split(' ');
	}, [timestamp]);

	return (
		<footer className='h-40 border-t border-gray-600 bg-gray-200 pr-32 flex-justify-between'>
			<div className='h-full flex-justify-start'>
				<span className='text-tiny font-normal text-gray-1000'>{t('footer.copyright')}</span>
			</div>

			<div style={{ gap: '2.8rem' }} className='h-full flex-justify-end'>
				<span
					className={clsx(
						'flex items-center gap-8 transition-colors',
						lsStatus === 'CONNECTING'
							? 'text-warning-100'
							: lsStatus === 'DISCONNECTED'
								? 'text-error-200'
								: 'text-success-200',
					)}
				>
					<WifiSVG full={!(lsStatus === 'CONNECTING' || lsStatus === 'DISCONNECTED')} />
				</span>

				<div className='h-full gap-12 border-r border-gray-600 px-32 ltr flex-justify-center'>
					<span style={{ fontSize: '1.3rem', width: '4.4rem' }} className='text-left text-gray-900'>
						{serverTime}
					</span>
					<span style={{ fontSize: '1.3rem', width: '5.6rem' }} className='text-right text-gray-900'>
						{serverDate}
					</span>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
