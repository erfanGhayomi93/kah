import {
	AssetSVG,
	DataAnalyticsSVG,
	HomeSVG,
	ReceptionSVG,
	ReportSVG,
	SettingSVG,
	StrategySVG,
	TvTradeSVG,
} from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setChangeBrokerModal, setDepositModal, setWithdrawalModal } from '@/features/slices/modalSlice';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { toggleSidebar } from '@/features/slices/uiSlice';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { memo, useEffect, useMemo, useState } from 'react';
import Item, { type TListItem } from './Item';
import styles from './Sidebar.module.scss';

interface ListProps {
	isExpand: boolean;
}

const List = ({ isExpand }: ListProps) => {
	const t = useTranslations();

	const pathname = usePathname();

	const dispatch = useAppDispatch();

	const [expandId, setExpandId] = useState<null | string>(null);

	const toggleItem = (id: string) => {
		if (isExpand) {
			setExpandId(expandId === id ? null : id);
		} else {
			dispatch(toggleSidebar(true));
			setExpandId(id);
		}
	};

	const onClickItem = (tagName: string) => {
		if (tagName === 'button') return false;

		dispatch(toggleSidebar(false));

		if (tagName === 'a') {
			dispatch(setSymbolInfoPanel(null));
		} else {
			// for open of modal
			if (tagName === 'deposit') {
				dispatch(setDepositModal({ isShow: true }));
			} else if (tagName === 'withdrawal') {
				dispatch(setWithdrawalModal({ isShow: true }));
			} else if (tagName === 'change_broker') {
				dispatch(setChangeBrokerModal({ isShow: true }));
			}
		}
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
				{
					id: 'my_assets',
					label: t('sidebar.my_assets'),
					to: '/a',
					icon: <AssetSVG />,
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
							to: '/market-map',
						},
					],
				},
				{
					id: 'strategy',
					label: t('sidebar.strategy'),
					to: '/strategy',
					icon: <StrategySVG />,
				},
				{
					id: 'technical',
					label: t('sidebar.technical'),
					to: '/a',
					icon: <DataAnalyticsSVG />,
				},
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
							isModal: true
						},
						{
							id: 'un_freezing',
							label: t('sidebar.un_freezing'),
							to: '/a',
						},
						{
							id: 'option_settlement',
							label: t('sidebar.option_settlement'),
							to: '/a',
						},
					],
				},
				{
					id: 'reports',
					label: t('sidebar.reports'),
					icon: <ReportSVG />,
					items: [
						{
							id: 'transactions',
							label: t('sidebar.transactions'),
							to: '/financial-reports/transactions',
							isBroker: true,
						},
						{
							id: 'instant_deposit',
							label: t('sidebar.instant_deposit'),
							to: '/financial-reports/instant-deposit',
							isBroker: true,
						},
						{
							id: 'deposit_with_receipt',
							label: t('sidebar.deposit_with_receipt'),
							to: '/financial-reports/deposit-with-receipt',
							isBroker: true,
						},
						{
							id: 'withdrawal_cash',
							label: t('sidebar.withdrawal_cash'),
							to: '/financial-reports/withdrawal-cash',
							isBroker: true,
						},
						{
							id: 'change_broker',
							label: t('sidebar.change_broker'),
							to: '/financial-reports/change-broker',
							isBroker: true,
						},
						{
							id: 'freeze_and_unFreeze',
							label: t('sidebar.freeze_and_unFreeze'),
							to: '/option-reports/freeze-and-unfreeze',
							isBroker: true,
						},
						{
							id: 'orders',
							label: t('sidebar.orders'),
							to: '/orders-and-trades-reports/orders',
							isBroker: true
						},
						{
							id: 'trades',
							label: t('sidebar.trades'),
							to: '/orders-and-trades-reports/trades',
							isBroker: true
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
			<ul className={clsx(styles.list, isExpand && styles.expand)}>
				{topList.map((item) => (
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

			<ul className={clsx(styles.list, isExpand && styles.expand)}>
				{bottomList.map((item) => (
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
	);
};

export default memo(List);
