'use client';

import { BearishMarketSVG, BullishMarketSVG, DirectionalMarketSVG, NeutralMarketSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getStrategyTrend, setStrategyTrend } from '@/features/slices/tabSlice';
import clsx from 'clsx';
import { useMemo } from 'react';

interface ITabItem {
	id: TStrategyMarketTrend;
	icon: React.ReactNode;
	title: string;
}

const Toolbar = () => {
	const t = (v: string) => v;

	const dispatch = useAppDispatch();

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

	return (
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
							<span className={item.id !== strategyTrend ? 'text-gray-1000' : ''}>{item.title}</span>
							{item.icon}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Toolbar;
