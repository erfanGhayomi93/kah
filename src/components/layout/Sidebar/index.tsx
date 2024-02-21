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
	UserBoldSVG,
	WatchlistSVG,
} from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getSidebarIsExpand, toggleSidebar } from '@/features/slices/uiSlice';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import Item, { type IListItem } from './Item';
import styles from './Sidebar.module.scss';

interface IItem {
	label: string;
	to: string;
	icon: JSX.Element;
}

const Sidebar = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const sidebarIsExpand = useAppSelector(getSidebarIsExpand);

	const toggle = () => {
		dispatch(toggleSidebar(!sidebarIsExpand));
	};

	const items: [IListItem[], IListItem[]] = useMemo(
		() => [
			[
				{
					label: 'صفحه اصلی',
					to: '/fa',
					icon: <HomeSVG />,
				},
				{
					label: 'دارایی من',
					to: '',
					icon: <CoinsSVG />,
				},
				{
					label: 'بازار',
					icon: <TradeSVG />,
					defaultExpand: true,
					items: [
						{
							label: 'دیده‌بان',
							to: '/fa',
							icon: <WatchlistSVG />,
						},
						{
							label: 'زنجیره قرارداد',
							to: '/fa/option-chain',
							icon: <OptionChainSVG />,
						},
						{
							label: 'زحل',
							to: '/fa/saturn',
							icon: <SaturnSVG />,
						},
						{
							label: 'نقشه بازار',
							to: '/fa/market-map',
							icon: <MarketMapSVG />,
						},
					],
				},
				{
					label: 'استراتژی',
					to: '',
					icon: <StrategySVG />,
				},
				{
					label: 'تکنیکال',
					to: '',
					icon: <DataAnalyticsSVG />,
				},
				{
					label: 'درخواست‌ها',
					to: '',
					icon: <ReceptionSVG />,
				},
				{
					label: 'گزارش‌ها',
					to: '',
					icon: <ReportSVG />,
				},
			],
			[
				{
					label: 'آموزش',
					to: '',
					icon: <LearnSVG />,
				},
				{
					label: 'تنظیمات',
					to: '',
					icon: <CogsSVG />,
				},
			],
		],
		[],
	);

	return (
		<div
			style={{
				width: sidebarIsExpand ? '212px' : '56px',
				transition: 'width 300ms ease-in-out',
			}}
			className='bg-sidebar relative pt-24'
		>
			{sidebarIsExpand && (
				<div className='items-center gap-12 text-center flex-column'>
					<div
						style={{ backgroundImage: 'url("/static/images/young-boy.png")' }}
						className={clsx('fit-image overflow-hidden', styles.profile)}
					/>
					<h3 className='text-base font-medium text-white'>{t('common.app_user')}</h3>
				</div>
			)}

			<button type='button' onClick={toggle} className={clsx(styles.toggler, sidebarIsExpand && styles.expand)}>
				<AngleLeft width='1.6rem' height='1.6rem' />
			</button>

			<div className='h-full flex-column'>
				{!sidebarIsExpand && (
					<nav className='flex-column' style={{ paddingBottom: '9.6rem' }}>
						<ul className={clsx(styles.list, sidebarIsExpand && styles.expand)}>
							<Item label='حساب کاربری' icon={<UserBoldSVG />} to='/' />
						</ul>
					</nav>
				)}

				<nav className={clsx('h-full flex-1 justify-between flex-column', sidebarIsExpand && 'pt-56')}>
					{items.map((list, i) => (
						<ul key={i} className={clsx(styles.list, sidebarIsExpand && styles.expand)}>
							{list.map((item, i) => (
								<Item key={i} {...item} />
							))}
						</ul>
					))}
				</nav>
			</div>
		</div>
	);
};

export default Sidebar;
