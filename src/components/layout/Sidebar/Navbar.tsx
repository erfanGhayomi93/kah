import Click from '@/components/common/Click';
import {
	DataAnalyticsSVG,
	HomeSVG,
	MoneySVG,
	ReceptionSVG,
	ReportSVG,
	StrategySVG,
	TvTradeSVG,
} from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { toggleSidebar } from '@/features/slices/uiSlice';
import { cn } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import Item, { type TListItem } from './Item';
import styles from './Sidebar.module.scss';

interface NavbarProps {
	isExpand: boolean;
}

const Navbar = ({ isExpand }: NavbarProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const [expandId, setExpandId] = useState<null | string>('market');

	const toggleItem = (id: string) => {
		if (isExpand) {
			setExpandId(expandId === id ? null : id);
		} else {
			dispatch(toggleSidebar(true));
			setExpandId(id);
		}
	};

	const collapseSidebar = () => {
		dispatch(toggleSidebar(false));
	};

	const onClickItem = (tagName: 'a' | 'button') => {
		if (tagName === 'a') collapseSidebar();
	};

	const items: TListItem[] = useMemo(
		() => [
			{
				id: 'home_page',
				label: t('sidebar.home_page'),
				to: '/',
				icon: <HomeSVG />,
			},
			{
				id: 'my_assets',
				label: t('sidebar.my_assets'),
				to: '/',
				icon: <MoneySVG />,
			},
			{
				id: 'market',
				label: t('sidebar.market'),
				icon: <TvTradeSVG />,
				items: [
					{
						id: 'watchlist',
						label: t('sidebar.watchlist'),
						to: '/watchlist',
					},
					{
						id: 'option_chain',
						label: t('sidebar.option_chain') + ' 1',
						to: '/option-chain-old',
					},
					{
						id: 'option_chain',
						label: t('sidebar.option_chain') + ' 2',
						to: '/option-chain',
					},
					{
						id: 'saturn',
						label: t('sidebar.saturn'),
						to: '/saturn',
					},
					{
						id: 'market_map',
						label: t('sidebar.market_map'),
						to: '/',
					},
				],
			},
			{
				id: 'strategy',
				label: t('sidebar.strategy'),
				to: '/',
				icon: <StrategySVG />,
			},
			{
				id: 'technical',
				label: t('sidebar.technical'),
				to: '/',
				icon: <DataAnalyticsSVG />,
			},
			{
				id: 'requests',
				label: t('sidebar.requests'),
				icon: <ReceptionSVG />,
				items: [
					{
						id: 'deposit_and_withdrawal',
						label: t('sidebar.deposit_and_withdrawal'),
						to: '/',
					},
					{
						id: 'change_broker',
						label: t('sidebar.change_broker'),
						to: '/',
					},
					{
						id: 'un_freezing',
						label: t('sidebar.un_freezing'),
						to: '/',
					},
					{
						id: 'option_settlement',
						label: t('sidebar.option_settlement'),
						to: '/',
					},
				],
			},
			{
				id: 'reports',
				label: t('sidebar.reports'),
				to: '/',
				icon: <ReportSVG />,
			},
		],
		[expandId],
	);

	return (
		<Click enabled={isExpand} onClickOutside={collapseSidebar}>
			<div className='z-10 flex-1 select-none flex-column'>
				<div className={clsx('px-16 py-12 flex-justify-start', isExpand && 'gap-8')}>
					<Image width='28' height='28' alt='Favicon' src='/static/icons/favicon.png' />
					<h2 className={clsx('text-base text-white', !isExpand && 'hidden')}>{t('sidebar.app_name')}</h2>
				</div>

				<nav className='h-full flex-1 justify-between gap-16 py-32 flex-column'>
					<ul className={cn(styles.list, isExpand && styles.expand)}>
						{items.map((item) => (
							<Item
								key={item.id}
								isExpand={item.id === expandId}
								toggle={() => toggleItem(item.id)}
								sidebarIsExpand={isExpand}
								onClick={onClickItem}
								{...item}
							/>
						))}
					</ul>
				</nav>
			</div>
		</Click>
	);
};

export default Navbar;
