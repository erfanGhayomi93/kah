'use client';

import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { Link, usePathname } from '@/navigation';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface ITabItem {
	title: string;
	href: string;
	isActive: boolean;
}

const ToolBar = () => {
	const t = useTranslations('settings_page');

	const brokerURLs = useAppSelector(getBrokerURLs);

	const path = usePathname();

	const tabs = useMemo<ITabItem[]>(
		() => [
			{
				title: t('general_settings'),
				href: '/settings/general/',
				isActive: true,
			},
			{
				title: t('orders_settings'),
				href: '/settings/orders/',
				isActive: Boolean(brokerURLs),
			},
			{
				title: t('agreements_settings'),
				href: '/settings/agreements/',
				isActive: Boolean(brokerURLs),
			},
			{
				title: t('sessions_settings'),
				href: '/settings/sessions/',
				isActive: true,
			},
		],
		[brokerURLs],
	);

	return (
		<div className='flex w-3/5 gap-10 py-24'>
			{tabs
				.filter((item) => item.isActive)
				.map((item) => (
					<Link
						href={item.href}
						key={item.href}
						style={{
							width: '13.6rem',
						}}
						className={clsx(
							'no-hover h-40 whitespace-nowrap rounded text-center text-base transition-colors flex-justify-center',
							path === item.href
								? 'btn-select'
								: 'bg-light-gray-100 text-light-gray-700 hover:btn-select',
						)}
					>
						{item.title}
					</Link>
				))}
		</div>
	);
};

export default ToolBar;
