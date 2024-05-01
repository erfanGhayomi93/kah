import Click from '@/components/common/Click';
import { useAppDispatch } from '@/features/hooks';
import { toggleSidebar } from '@/features/slices/uiSlice';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import List from './List';

interface NavbarProps {
	isExpand: boolean;
}

const Navbar = ({ isExpand }: NavbarProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const collapseSidebar = () => {
		dispatch(toggleSidebar(false));
	};

	return (
		<Click enabled={isExpand} onClickOutside={collapseSidebar}>
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
		</Click>
	);
};

export default Navbar;
