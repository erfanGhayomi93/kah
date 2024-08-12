import { Link, usePathname } from '@/navigation';
import { comparePathname } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

interface IAnchor {
	id: string;
	title: string;
	href: string;
}

interface ItemProps extends IAnchor {
	isActive: boolean;
}

const PageTabs = () => {
	const t = useTranslations('my_assets');

	const pathname = usePathname();

	const search = useSearchParams().toString();

	const pages = useMemo<IAnchor[]>(
		() => [
			{
				id: 'stocks',
				title: t('tab_stocks'),
				href: '/my-assets/stocks',
			},
			{
				id: 'position',
				title: t('tab_position'),
				href: '/my-assets/position',
			},
			/* {
				id: 'strategy',
				title: t('tab_strategy'),
				href: '/my-assets/strategy',
			},
			{
				id: 'assets',
				title: t('tab_all'),
				href: '/my-assets/all',
			}, */
		],
		[],
	);

	return (
		<div className='flex-1 gap-24 flex-justify-start'>
			<h1 className='text-xl font-medium text-gray-700'>{t('title')}</h1>

			<ul className='gap-8 flex-items-center'>
				{pages.map((item) => (
					<Item
						key={item.id}
						{...item}
						href={`${item.href}?${search}`}
						isActive={comparePathname(pathname, item.href)}
					/>
				))}
			</ul>
		</div>
	);
};

const Item = ({ title, href, isActive }: ItemProps) => {
	return (
		<li>
			<Link
				href={href}
				className={clsx(
					'h-40 w-104 rounded text-base transition-colors flex-justify-center',
					isActive ? 'no-hover btn-select' : 'bg-gray-100 text-gray-700',
				)}
			>
				{title}
			</Link>
		</li>
	);
};

export default PageTabs;
