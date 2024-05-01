'use client';

import { BearishMarketSVG, BullishMarketSVG, DirectionalMarketSVG, NeutralMarketSVG } from '@/components/icons';
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

	const isStrategiesListPage = /^\/?strategy\/?$/gi.test(pathname);

	return (
		<div
			style={{ flex: '0 0 5.6rem' }}
			className='flex-1 gap-24 overflow-hidden rounded bg-white px-16 flex-justify-start'
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

			{isStrategiesListPage && <span className='w-2 h-12 bg-gray-500' />}

			{isStrategiesListPage && (
				<div className='gap-16 flex-items-center'>
					<h4 className='text-gray-900'>{t('strategies.market_process')}:</h4>

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
											: 'border-gray-500 text-gray-900 hover:btn-hover',
									)}
								>
									<span className={item.id !== strategyTrend ? 'text-gray-1000' : ''}>
										{item.title}
									</span>
									{item.icon}
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default Toolbar;
