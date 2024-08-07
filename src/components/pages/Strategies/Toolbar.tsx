'use client';

import { BearishMarketSVG, BullishMarketSVG, DirectionalMarketSVG, NeutralMarketSVG } from '@/components/icons';
import { Link, usePathname } from '@/navigation';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

interface ITabItem {
	id: TStrategyMarketTrend;
	icon: React.ReactNode;
	title: string;
}

const Toolbar = () => {
	const t = useTranslations();

	const pathname = usePathname();

	const search = useSearchParams();

	const tags = useMemo<ITabItem[]>(
		() => [
			{
				id: 'All',
				title: t('strategy_cheaps.All'),
				icon: null,
			},
			{
				id: 'BullishMarket',
				title: t('strategy_cheaps.BullishMarket'),
				icon: <BullishMarketSVG />,
			},
			{
				id: 'NeutralMarket',
				title: t('strategy_cheaps.NeutralMarket'),
				icon: <NeutralMarketSVG />,
			},
			{
				id: 'DirectionalMarket',
				title: t('strategy_cheaps.DirectionalMarket'),
				icon: <DirectionalMarketSVG />,
			},
			{
				id: 'BearishMarket',
				title: t('strategy_cheaps.BearishMarket'),
				icon: <BearishMarketSVG />,
			},
		],
		[],
	);

	const strategyTrend = search.get('type') ?? 'All';

	return (
		<div className='gap-16 flex-items-center'>
			<h4 className='text-gray-700'>{t('strategies.market_process')}:</h4>

			<ul className='flex gap-8'>
				{tags.map((item) => (
					<li key={item.id}>
						<Link
							href={`${pathname}?type=${item.id}`}
							className={clsx(
								'h-40 w-96 rounded text-base transition-colors flex-justify-center',
								item.id === strategyTrend
									? 'no-hover font-medium btn-select'
									: 'bg-gray-100 text-gray-700',
							)}
						>
							<span className={item.id !== strategyTrend ? 'text-gray-800' : ''}>{item.title}</span>
							{item.icon}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Toolbar;
