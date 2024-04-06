import { ArrowUpSVG, DragSVG } from '@/components/icons';
import clsx from 'clsx';
import React, { useState } from 'react';

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
	const [activeTab, setActiveTab] = useState(defaultActiveTab);

	const [isExpand, setIsExpand] = useState(true);

	const onExpand = () => {
		setIsExpand(!isExpand);
	};

	return (
		<div
			style={{ height: isExpand ? '100%' : '4rem' }}
			className='size-full overflow-hidden rounded bg-white transition-height flex-column'
		>
			<div
				style={{ flex: '0 0 4rem' }}
				className='overflow-hidden rounded-t bg-gray-200 pl-12 flex-justify-between'
			>
				<ul className='flex-1 flex-items-center'>
					{tabs.map((tab, index) => (
						<li key={tab.id}>
							<button
								onClick={() => {
									setActiveTab(tab.id);
									if (!isExpand) setIsExpand(true);
								}}
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
					<button type='button' className='text-gray-800' onClick={onExpand}>
						<ArrowUpSVG
							width='1.8rem'
							height='1.8rem'
							className='transition-transform'
							style={{ transform: `rotate(${isExpand ? 180 : 0}deg)` }}
						/>
					</button>

					<button type='button' className='drag-handler text-gray-800'>
						<DragSVG width='2rem' height='2rem' />
					</button>
				</div>
			</div>

			{children}
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
