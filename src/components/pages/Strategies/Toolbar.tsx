'use client';

import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getStrategyTrend, setStrategyTrend } from '@/features/slices/tabSlice';
import { Link, usePathname } from '@/navigation';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';
interface ITabItem {
	id: TStrategyMarketTrend;
	icon: React.ReactNode;
	title: string;
}

const Toolbar = () => {
	const pathname = usePathname();

	const dispatch = useAppDispatch();

	const t = useTranslations();

	const strategyTrend = useAppSelector(getStrategyTrend);

	const tags = useMemo<ITabItem[]>(
		() => [
			{
				id: 'all',
				title: t('strategies.tag_all'),
				icon: null,
			},
			{
				id: 'BullishMarket',
				title: t('strategies.tag_BullishMarket'),
				icon: null,
			},
			{
				id: 'NeutralMarket',
				title: t('strategies.tag_NeutralMarket'),
				icon: null,
			},
			{
				id: 'DirectionalMarket',
				title: t('strategies.tag_DirectionalMarket'),
				icon: null,
			},
			{
				id: 'BearishMarket',
				title: t('strategies.tag_BearishMarket'),
				icon: null,
			},
		],
		[],
	);

	const isStrategiesListPage = /^\/?strategy\/?$/gi.test(pathname);

	return (
		<div
			style={{ flex: '0 0 5.6rem' }}
			className='flex-1 gap-36 overflow-hidden rounded bg-white px-16 flex-justify-start'
		>
			<ul className='flex gap-8'>
				<li>
					<Link
						style={{ width: '14rem' }}
						className={clsx(
							'h-40 rounded !border transition-colors flex-justify-center',
							isStrategiesListPage
								? 'no-hover font-medium btn-select'
								: 'border-gray-200 bg-gray-200 text-gray-900',
						)}
						href='/strategy'
					>
						{t('strategies.prepared_strategy')}
					</Link>
				</li>
				<li>
					<Link
						style={{ width: '14rem' }}
						className={clsx(
							'h-40 rounded !border transition-colors flex-justify-center',
							!isStrategiesListPage
								? 'no-hover font-medium btn-select'
								: 'border-gray-200 bg-gray-200 text-gray-900',
						)}
						href='/strategy/build'
					>
						{t('strategies.build_strategy')}
					</Link>
				</li>
			</ul>

			{isStrategiesListPage && (
				<ul className='flex gap-8'>
					{tags.map((item) => (
						<li key={item.id}>
							<button
								onClick={() => dispatch(setStrategyTrend(item.id))}
								type='button'
								className={clsx(
									'h-40 w-96 rounded !border text-base transition-colors flex-justify-center',
									item.id === strategyTrend
										? 'no-hover font-medium btn-select'
										: 'border-gray-500 text-gray-1000 hover:btn-hover',
								)}
							>
								{item.title}
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default Toolbar;
