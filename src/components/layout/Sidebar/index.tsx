import { AngleLeftSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getSidebarIsExpand, toggleSidebar } from '@/features/slices/uiSlice';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import styles from './Sidebar.module.scss';

const Navbar = dynamic(() => import('./Navbar'), {
	ssr: false,
});

const Sidebar = () => {
	const dispatch = useAppDispatch();

	const isExpand = useAppSelector(getSidebarIsExpand);

	const toggle = () => dispatch(toggleSidebar(!isExpand));

	return (
		<div
			style={{
				width: isExpand ? '18.4rem' : '6rem',
				transition: 'width 300ms',
				zIndex: 999,
			}}
			className='fixed right-0 top-0 h-full bg-sidebar'
		>
			<div className='relative h-full flex-column'>
				<button
					type='button'
					onClick={toggle}
					className={clsx('sidebar-toggler', styles.toggler, isExpand && styles.expand)}
				>
					<AngleLeftSVG width='1.6rem' height='1.6rem' />
				</button>

				<Navbar isExpand={isExpand} />
			</div>
		</div>
	);
};

export default Sidebar;
