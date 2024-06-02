import RenderOnViewportEntry from '@/components/common/RenderOnViewportEntry ';
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
			className='size-full overflow-hidden rounded bg-white transition-height flex-column'
		>
			<div
				onClick={() => setIsExpand(true)}
				style={{ flex: '0 0 4rem' }}
				className='overflow-hidden rounded-t bg-gray-200 pl-12 flex-justify-between'
			>
				<ul className='flex-1 flex-items-center'>
					{tabs.map((tab, index) => (
						<li key={tab.id}>
							<button
								onClick={(e) => onTabClick(e, tab)}
								type='button'
								style={{ minWidth: '13.6rem' }}
								className={clsx(
									'relative h-40 w-full rounded-t px-16 text-base transition-colors flex-justify-center',
									isExpand && tab.id === activeTab
										? 'bg-white font-medium text-gray-900'
										: 'text-gray-700',
								)}
							>
								{tab.title}
								{activeTab === tab.id && (
									<>
										{index > 0 && <RoundSVG style={{ left: '100%' }} />}
										<RoundSVG style={{ right: '100%' }} />
									</>
								)}
							</button>
						</li>
					))}
				</ul>

				<div className='gap-8 flex-items-center'>
					<button
						type='button'
						className='text-gray-800'
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
						className='drag-handler text-gray-800'
						onClick={(e) => {
							e.stopPropagation();
							e.preventDefault();
						}}
					>
						<DragSVG width='2rem' height='2rem' />
					</button>
				</div>
			</div>

			{isExpand && (
				<RenderOnViewportEntry className='relative h-full overflow-hidden'>{children}</RenderOnViewportEntry>
			)}
		</div>
	);
};

const RoundSVG = (props: React.SVGProps<SVGSVGElement>) => (
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

export default Section;
