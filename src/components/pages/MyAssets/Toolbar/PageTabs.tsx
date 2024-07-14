import { Link, usePathname } from '@/navigation';
import { comparePathname } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

type TItem = Record<'id' | 'title' | 'to', string>;

interface ItemProps extends TItem {
	isActive: boolean;
}

const PageTabs = () => {
	const t = useTranslations('my_assets');

	const pathname = usePathname();

	const searchParams = useSearchParams().toString();

	const pages = useMemo<TItem[]>(
		() => [
			{
				id: 'stocks',
				title: t('tab_stocks'),
				to: '/my-assets/stocks',
			},
			{
				id: 'position',
				title: t('tab_position'),
				to: '/my-assets/position',
			},
			{
				id: 'strategy',
				title: t('tab_strategy'),
				to: '/my-assets/strategy',
			},
			{
				id: 'assets',
				title: t('tab_all'),
				to: '/my-assets/all',
			},
		],
		[],
	);

	return (
		<div className='flex-1 gap-24 flex-justify-start'>
			<h1 className='text-xl font-medium text-light-gray-700'>{t('title')}</h1>

			<ul className='gap-8 flex-items-center'>
				{pages.map((item) => (
					<Item
						key={item.id}
						{...item}
						to={`${item.to}?${searchParams}`}
						isActive={comparePathname(pathname, item.to)}
					/>
				))}
			</ul>
		</div>
	);
};

const Item = ({ title, to, isActive }: ItemProps) => {
	return (
		<li>
			<Link
				href={to}
				className={clsx(
					'h-40 w-104 rounded text-base transition-colors flex-justify-center',
					isActive ? 'no-hover !border btn-select' : 'bg-light-gray-100 text-light-gray-700',
				)}
			>
				{title}
			</Link>
		</li>
	);
};

export default PageTabs;
