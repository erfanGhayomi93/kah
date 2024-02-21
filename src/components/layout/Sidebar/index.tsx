import {
	CogsSVG,
	CoinsSVG,
	DataAnalyticsSVG,
	HomeSVG,
	LearnSVG,
	ReceptionSVG,
	ReportSVG,
	StrategySVG,
	TradeSVG,
} from '@/components/icons';
import { useAppSelector } from '@/features/hooks';
import { getSidebarIsExpand } from '@/features/slices/uiSlice';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import Item, { type ItemProps } from './Item';
import styles from './Sidebar.module.scss';

const Sidebar = () => {
	const t = useTranslations();

	const sidebarIsExpand = useAppSelector(getSidebarIsExpand);

	const items: [ItemProps[], ItemProps[]] = useMemo(
		() => [
			[
				{
					label: 'صفحه اصلی',
					to: '',
					icon: <HomeSVG />,
				},
				{
					label: 'دارایی من',
					to: '',
					icon: <CoinsSVG />,
				},
				{
					label: 'بازار',
					to: '',
					icon: <TradeSVG />,
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
				transition: 'width 250ms ease-in-out',
				backgroundColor: 'rgba(15, 21, 39, 1)',
			}}
			className='pt-24'
		>
			<div className='items-center gap-12 text-center flex-column'>
				<div
					style={{ backgroundImage: 'url("/static/images/young-boy.png")' }}
					className={clsx('fit-image', styles.profile)}
				/>
				<h3 className='text-base font-medium text-white'>{t('common.app_user')}</h3>
			</div>

			<nav className='flex-1 justify-between py-56 flex-column'>
				{items.map((list, i) => (
					<ul key={i} className='flex-column'>
						{list.map((item, i) => (
							<Item key={i} {...item} />
						))}
					</ul>
				))}
			</nav>
		</div>
	);
};

export default Sidebar;
