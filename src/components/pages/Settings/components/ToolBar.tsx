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

	const tags = useMemo<ITabItem[]>(
		() => [
			{
				title: t('general_settings'),
				href: '/settings/general/',
				isActive: true,
			},
			{
				title: t('orders_settings'),
				href: '/settings/orders/',
				isActive: !!brokerURLs,
			},
			{
				title: t('agreements_settings'),
				href: '/settings/agreements/',
				isActive: !!brokerURLs,
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
			{tags.map((item) => (
				<Link
					href={item.href}
					key={item.href}
					type='button'
					className={clsx(
						'h-36 w-1/4 gap-4 rounded !border px-16 text-base  transition-colors',
						item.isActive ? 'whitespace-nowrap flex-justify-center' : 'hidden',
						path === item.href
							? 'no-hover btn-select'
							: 'bg-light-gray-100 text-light-gray-700 hover:text-light-primary-100 hover:btn-hover',
					)}
				>
					{item.title}
				</Link>
			))}
		</div>
	);
};

export default ToolBar;
