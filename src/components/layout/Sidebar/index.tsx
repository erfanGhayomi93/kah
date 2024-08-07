import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getSidebarIsExpand, toggleSidebar } from '@/features/slices/uiSlice';
import { Link } from '@/navigation';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import List from './List';

const Sidebar = () => {
	const t = useTranslations();

	const sidebarIsExpand = useAppSelector(getSidebarIsExpand);

	const dispatch = useAppDispatch();

	const [expandId, setExpandId] = useState<string | null>(null);

	const closeSidebar = () => {
		dispatch(toggleSidebar(false));
		setExpandId(null);
	};

	return (
		<div
			style={{
				width: sidebarIsExpand ? '18.4rem' : '6rem',
				transition: 'width 300ms',
				zIndex: 99999,
				boxShadow: '0 4px 4px rgba(0, 0, 0, 0.25)',
			}}
			className='fixed right-0 top-0 h-full bg-gray-800 darkness:bg-gray-50'
			onMouseLeave={closeSidebar}
		>
			<div className='relative h-full flex-column'>
				<div className='z-10 flex-1 select-none overflow-hidden flex-column'>
					<Link
						href='/'
						style={{ minWidth: '5.4rem', height: '5.4rem' }}
						className={clsx('pr-16 flex-justify-start', sidebarIsExpand && 'gap-8')}
					>
						<Image width='30' height='30' alt='favicon' src='/static/icons/favicon.png' />
						<h2 className={clsx('text-base text-white', !sidebarIsExpand && 'hidden')}>
							{t('sidebar.app_name')}
						</h2>
					</Link>

					<List sidebarIsExpand={sidebarIsExpand} expandId={expandId} setExpandId={setExpandId} />
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
