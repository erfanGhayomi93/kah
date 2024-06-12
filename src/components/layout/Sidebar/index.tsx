import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getSidebarIsExpand, toggleSidebar } from '@/features/slices/uiSlice';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import List from './List';

const Sidebar = () => {
	const t = useTranslations();

	const isExpand = useAppSelector(getSidebarIsExpand);

	const dispatch = useAppDispatch();

	return (
		<div
			style={{
				width: isExpand ? '18.4rem' : '6rem',
				transition: 'width 300ms',
				zIndex: 999,
			}}
			className='fixed right-0 top-0 h-full bg-sidebar'
			onMouseLeave={() => dispatch(toggleSidebar(false))}
		>
			<div className='relative h-full flex-column'>
				<div className='z-10 flex-1 select-none overflow-hidden flex-column'>
					<div
						style={{ minWidth: '5.4rem', height: '5.4rem' }}
						className={clsx('pr-16 flex-justify-start', isExpand && 'gap-8')}
					>
						<Image width='30' height='30' alt='favicon' src='/static/icons/favicon.png' />
						<h2 className={clsx('text-base text-white', !isExpand && 'hidden')}>{t('sidebar.app_name')}</h2>
					</div>

					<List isExpand={isExpand} />
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
