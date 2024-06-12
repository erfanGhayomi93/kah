import { HomeSVG, ReceptionSVG, ReportSVG, SettingSVG, StrategySVG, TvTradeSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import {
	setChangeBrokerModal,
	setDepositModal,
	setFreezeModal,
	setOptionSettlementModal,
	setWithdrawalModal,
} from '@/features/slices/modalSlice';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { toggleSidebar } from '@/features/slices/uiSlice';
import { usePathname } from '@/navigation';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
import Item, { type TListItem } from './Item';
import styles from './Sidebar.module.scss';

interface ListProps {
	sidebarIsExpand: boolean;
	expandId: string | null;
	setExpandId: (v: string | null) => void;
}

const List = ({ sidebarIsExpand, expandId, setExpandId }: ListProps) => {
	const t = useTranslations();

	const pathname = usePathname();

	const dispatch = useAppDispatch();

	const toggleItem = (id: string) => {
		if (sidebarIsExpand) {
			setExpandId(expandId === id ? null : id);
		} else {
			toggle(true);
			setExpandId(id);
		}
	};

	const onClickItem = (tagName: string) => {
		if (tagName === 'button') return false;

		toggle(false);

		if (tagName === 'a') {
			dispatch(setSymbolInfoPanel(null));
		} else {
			// for open of modal
			if (tagName === 'deposit') {
				dispatch(setDepositModal({}));
			} else if (tagName === 'withdrawal') {
				dispatch(setWithdrawalModal({}));
			} else if (tagName === 'change_broker') {
				dispatch(setChangeBrokerModal({}));
			} else if (tagName === 'un_freezing') {
				dispatch(setFreezeModal({}));
			} else if (tagName === 'option_settlement') {
				dispatch(setOptionSettlementModal({}));
			}
		}
	};

	const toggle = (v: boolean) => {
		dispatch(toggleSidebar(v));
	};

	const [topList, bottomList]: TListItem[][] = useMemo(
		() => [
			[
				{
					id: 'home_page',
					label: t('sidebar.home_page'),
					to: '/',
					icon: <HomeSVG />,
				},
				// {
				// 	id: 'my_assets',
				// 	label: t('sidebar.my_assets'),
				// 	to: '/a',
				// 	icon: <AssetSVG />,
				// },
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
							to: '/market-map',
							isBroker: true,
						},
					],
				},
				{
					id: 'strategy',
					label: t('sidebar.strategy'),
					to: '/strategy',
					icon: <StrategySVG />,
				},
				// {
				// 	id: 'technical',
				// 	label: t('sidebar.technical'),
				// 	to: '/technical',
				// 	icon: <DataAnalyticsSVG />,
				// },
				{
					id: 'requests',
					label: t('sidebar.requests'),
					icon: <ReceptionSVG />,
					items: [
						{
							id: 'deposit',
							label: t('sidebar.deposit'),
							isModal: true,
						},
						{
							id: 'withdrawal',
							label: t('sidebar.withdrawal'),
							isModal: true,
						},
						{
							id: 'change_broker',
							label: t('sidebar.change_broker'),
							isModal: true,
						},
						{
							id: 'un_freezing',
							label: t('sidebar.un_freezing'),
							isModal: true,
						},
						{
							id: 'option_settlement',
							label: t('sidebar.option_settlement'),
							isModal: true,
						},
					],
				},
				{
					id: 'reports',
					label: t('sidebar.reports'),
					icon: <ReportSVG />,
					items: [
						{
							id: 'financial',
							label: t('sidebar.financial'),
							to: '/financial-reports/transactions',
							isBroker: true,
						},
						{
							id: 'option',
							label: t('sidebar.option'),
							to: '/option-reports/freeze-and-unfreeze',
							isBroker: true,
						},
						{
							id: 'deposit_with_receipt',
							label: t('sidebar.orders'),
							to: '/orders-and-trades-reports/orders',
							isBroker: true,
						},
						{
							id: 'change_broker',
							label: t('sidebar.change_broker'),
							to: '/change-broker-reports',
							isBroker: true,
						},
					],
				},
			],
			[
				{
					id: 'setting',
					label: t('sidebar.setting'),
					to: '/settings/general/',
					icon: <SettingSVG />,
				},
			],
		],
		[expandId],
	);

	useEffect(() => {
		setExpandId(null);
	}, [pathname]);

	return (
		<nav className='h-full flex-1 justify-between gap-16 py-32 flex-column'>
			<ul className={clsx(styles.list, sidebarIsExpand && styles.expand)}>
				{topList.map((item) => (
					<Item
						key={item.id}
						isExpand={item.id === expandId}
						toggle={() => toggleItem(item.id)}
						sidebarIsExpand={sidebarIsExpand}
						onClick={onClickItem}
						{...item}
					/>
				))}
			</ul>

			<ul className={clsx(styles.list, sidebarIsExpand && styles.expand)}>
				{bottomList.map((item) => (
					<Item
						key={item.id}
						isExpand={item.id === expandId}
						toggle={() => toggleItem(item.id)}
						sidebarIsExpand={sidebarIsExpand}
						onClick={onClickItem}
						{...item}
					/>
				))}
			</ul>
		</nav>
	);
};

export default List;
