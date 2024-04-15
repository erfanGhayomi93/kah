import { useAppSelector } from '@/features/hooks';
import { getLsStatus } from '@/features/slices/uiSlice';
import { cn } from '@/utils/helpers';
import { useTranslations } from 'next-intl';

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
	const t = useTranslations();

	const lsStatus = useAppSelector(getLsStatus);

	return (
		<footer className='h-40 border-t border-gray-600 bg-gray-200 px-24 flex-justify-between'>
			<div className='h-full flex-justify-start'>
				<a
					target='_blank'
					href='https://ramandtech.com/'
					className='text-tiny font-normal text-gray-1000 transition-colors hover:text-secondary-300'
				>
					{t('footer.copyright')}
				</a>
			</div>

			<div style={{ gap: '2.8rem' }} className='h-full flex-justify-end'>
				<span
					className={cn(
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
			</div>
		</footer>
	);
};

export default Footer;
