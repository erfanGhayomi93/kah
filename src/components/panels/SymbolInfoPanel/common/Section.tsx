import { ArrowUpSVG, DragSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getSymbolInfoPanelGridLayout, setSymbolInfoPanelGridLayout } from '@/features/slices/uiSlice';
import clsx from 'clsx';
import React, { useMemo, useState } from 'react';

export interface ITabIem<T extends string = string> {
	id: T;
	title: string;
}

interface SectionProps<T extends string> {
	name: TSymbolInfoPanelSections;
	defaultActiveTab: T;
	tabs: Array<ITabIem<T>>;
	children?: React.ReactNode;
	onChange?: (tab: T) => void;
}

const Section = <T extends string = string>({ name, defaultActiveTab, tabs, children, onChange }: SectionProps<T>) => {
	const dispatch = useAppDispatch();

	const symbolInfoPanelGridLayout = useAppSelector(getSymbolInfoPanelGridLayout);

	const [activeTab, setActiveTab] = useState(defaultActiveTab);

	const setIsExpand = (expand?: boolean) => {
		const l = JSON.parse(JSON.stringify(symbolInfoPanelGridLayout)) as typeof symbolInfoPanelGridLayout;
		const i = l.findIndex((item) => item.id === name);

		if (i === -1) return;

		l[i].expand = expand ?? !isExpand;
		dispatch(setSymbolInfoPanelGridLayout(l));
	};

	const onTabClick = (e: React.MouseEvent, tab: ITabIem<T>) => {
		e.preventDefault();
		e.stopPropagation();

		try {
			setActiveTab(tab.id);
			onChange?.(tab.id);
			if (!isExpand) setIsExpand(true);
		} catch (e) {
			//
		}
	};

	const isExpand = useMemo(() => {
		return symbolInfoPanelGridLayout.find((item) => item.id === name)?.expand !== false;
	}, [symbolInfoPanelGridLayout]);

	return (
		<div
			style={{ height: isExpand ? '100%' : '4rem' }}
			className='darkBlue:bg-gray-50 size-full overflow-hidden rounded bg-white transition-height flex-column dark:bg-gray-50'
		>
			<div
				onClick={() => setIsExpand(true)}
				style={{ flex: '0 0 4rem' }}
				className='overflow-hidden rounded-t bg-gray-100 pl-8 flex-justify-between'
			>
				<ul className='flex-1 flex-items-center'>
					{tabs.map((tab, index) => (
						<li key={tab.id}>
							<button
								onClick={(e) => onTabClick(e, tab)}
								type='button'
								style={{ minWidth: tabs.length <= 2 ? '13.6rem' : undefined }}
								className={clsx(
									'relative h-40 w-full rounded-t text-base transition-colors flex-justify-center',
									tabs.length <= 2 ? 'px-16' : 'px-8',
									isExpand && tab.id === activeTab
										? 'darkBlue:bg-gray-50 bg-white font-medium text-gray-700 dark:bg-gray-50'
										: 'text-gray-500',
								)}
							>
								{tab.title}
								{activeTab === tab.id && (
									<>
										{index > 0 && <RoundRightSVG style={{ left: '100%' }} />}
										<RoundLeftSVG style={{ right: '100%' }} />
									</>
								)}
							</button>
						</li>
					))}
				</ul>

				<div className='flex-items-center *:size-32 *:text-gray-600 *:flex-justify-center'>
					<button
						type='button'
						onClick={(e) => {
							e.stopPropagation();
							e.preventDefault();
							setIsExpand();
						}}
					>
						<ArrowUpSVG
							width='1.6rem'
							height='1.6rem'
							className='transition-transform'
							style={{ transform: `rotate(${isExpand ? 0 : 180}deg)` }}
						/>
					</button>

					<button
						type='button'
						className='drag-handler'
						onClick={(e) => {
							e.stopPropagation();
							e.preventDefault();
						}}
					>
						<DragSVG width='2rem' height='2rem' />
					</button>
				</div>
			</div>

			{isExpand && <div className='relative h-full overflow-hidden'>{children}</div>}
		</div>
	);
};

const RoundLeftSVG = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		width='12'
		height='9'
		viewBox='0 0 12 9'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		className='absolute bottom-0 text-white'
		{...props}
	>
		<path d='M0 9C10.8 9 12 3 12 0V9H0Z' fill='currentColor' />
	</svg>
);

const RoundRightSVG = (props: React.SVGProps<SVGSVGElement>) => (
	<svg
		width='12'
		height='9'
		viewBox='0 0 12 9'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		className='absolute bottom-0 text-white'
		{...props}
	>
		<path d='M12 9C1.2 9 0 3 0 0V9H12Z' fill='white' />
	</svg>
);

export default Section;
