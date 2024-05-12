'use client';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { Link } from '@/navigation';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

interface ITabItem {
	title: string;
	href: string;
	isActive: boolean;
}

const ToolBar = () => {
	const t = useTranslations();

	const brokerURLs = useAppSelector(getBrokerURLs);

	const path = usePathname();

	const tags = useMemo<ITabItem[]>(
		() => [
			{
				title: t('settings_page.general_settings'),
				href: '/settings/general/',
				isActive: true,
			},
			{
				title: t('settings_page.send_order_settings'),
				href: '/settings/send_order/',
				isActive: !!brokerURLs,
			},
			{
				title: t('settings_page.agreements_settings'),
				href: '/settings/agreements/',
				isActive: !!brokerURLs,
			},
			{
				title: t('settings_page.history_settings'),
				href: '/settings/history/',
				isActive: true,
			},
		],
		[brokerURLs],
	);

	return (
		<div className='flex w-full gap-10 py-24'>
			{tags.map((item) => (
				<Link
					href={item.href}
					key={item.href}
					type='button'
					className={clsx(
						'h-36 gap-4 rounded !border px-16 text-base  transition-colors',
						item.isActive ? 'flex-justify-center' : 'hidden',
						path === item.href
							? 'no-hover btn-select'
							: 'bg-gray-200 text-gray-900 hover:text-primary-400 hover:btn-hover',
					)}
				>
					{item.title}
				</Link>
			))}
		</div>
	);
};

export default ToolBar;
