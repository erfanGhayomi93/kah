import { AngleLeft } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getSidebarIsExpand, toggleSidebar } from '@/features/slices/uiSlice';
import { cn } from '@/utils/helpers';
import dynamic from 'next/dynamic';
import styles from './Sidebar.module.scss';

const Navbar = dynamic(() => import('./Navbar'), {
	ssr: false,
});

const Sidebar = () => {
	const dispatch = useAppDispatch();

	const isExpand = useAppSelector(getSidebarIsExpand);

	const toggle = () => {
		dispatch(toggleSidebar(!isExpand));
	};

	return (
		<div
			style={{
				width: isExpand ? '212px' : '56px',
				transition: 'width 300ms ease-in-out',
			}}
			className='relative bg-sidebar flex-column'
		>
			<button type='button' onClick={toggle} className={cn(styles.toggler, isExpand && styles.expand)}>
				<AngleLeft width='1.6rem' height='1.6rem' />
			</button>

			<Navbar isExpand={isExpand} />
		</div>
	);
};

export default Sidebar;
