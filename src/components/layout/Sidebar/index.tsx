import {
	AngleLeft,
	CogsSVG,
	CoinsSVG,
	DataAnalyticsSVG,
	HomeSVG,
	LearnSVG,
	MarketMapSVG,
	OptionChainSVG,
	ReceptionSVG,
	ReportSVG,
	SaturnSVG,
	StrategySVG,
	TradeSVG,
	WatchlistSVG,
} from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getSidebarIsExpand, toggleSidebar } from '@/features/slices/uiSlice';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import Item, { type TListItem } from './Item';
import styles from './Sidebar.module.scss';

const Sidebar = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const sidebarIsExpand = useAppSelector(getSidebarIsExpand);

	const [expandId, setExpandId] = useState<null | string>('market');

	const toggle = () => {
		dispatch(toggleSidebar(!sidebarIsExpand));
	};

	const toggleItem = (id: string) => {
		setExpandId(expandId === id ? null : id);
	};

	const items: [TListItem[], TListItem[]] = useMemo(
		() => [
			[
				{
					id: 'home_page',
					label: t('sidebar.home_page'),
					to: '/fa',
					icon: <HomeSVG />,
				},
				{
					id: 'my_assets',
					label: t('sidebar.my_assets'),
					to: '',
					icon: <CoinsSVG />,
				},
				{
					id: 'market',
					label: t('sidebar.market'),
					icon: <TradeSVG />,
					isExpand: expandId === 'market',
					items: [
						{
							id: 'watchlist',
							label: t('sidebar.watchlist'),
							to: '/fa',
							icon: <WatchlistSVG />,
						},
						{
							id: 'option_chain',
							label: t('sidebar.option_chain'),
							to: '/fa/option-chain',
							icon: <OptionChainSVG />,
						},
						{
							id: 'saturn',
							label: t('sidebar.saturn'),
							to: '/fa/saturn',
							icon: <SaturnSVG />,
						},
						{
							id: 'market_map',
							label: t('sidebar.market_map'),
							to: '/fa/market-map',
							icon: <MarketMapSVG />,
						},
					],
				},
				{
					id: 'strategy',
					label: t('sidebar.strategy'),
					to: '',
					icon: <StrategySVG />,
				},
				{
					id: 'technical',
					label: t('sidebar.technical'),
					to: '',
					icon: <DataAnalyticsSVG />,
				},
				{
					id: 'requests',
					label: t('sidebar.requests'),
					to: '',
					icon: <ReceptionSVG />,
				},
				{
					id: 'reports',
					label: t('sidebar.reports'),
					to: '',
					icon: <ReportSVG />,
				},
			],
			[
				{
					id: 'learn',
					label: t('sidebar.learn'),
					to: '',
					icon: <LearnSVG />,
				},
				{
					id: 'setting',
					label: t('sidebar.setting'),
					to: '',
					icon: <CogsSVG />,
				},
			],
		],
		[expandId],
	);

	return (
		<div
			style={{
				width: sidebarIsExpand ? '212px' : '56px',
				transition: 'width 300ms ease-in-out',
			}}
			className='bg-sidebar relative flex-column'
		>
			<button type='button' onClick={toggle} className={clsx(styles.toggler, sidebarIsExpand && styles.expand)}>
				<AngleLeft width='1.6rem' height='1.6rem' />
			</button>

			<div className='flex-1 flex-column'>
				<nav className='h-full flex-1 justify-between gap-16 py-32 flex-column'>
					{items.map((list, i) => (
						<ul key={i} className={clsx(styles.list, sidebarIsExpand && styles.expand)}>
							{list.map((item) => (
								<Item
									key={item.id}
									toggle={() => toggleItem(item.id)}
									sidebarIsExpand={sidebarIsExpand}
									{...item}
								/>
							))}
						</ul>
					))}
				</nav>
			</div>
		</div>
	);
};

export default Sidebar;
