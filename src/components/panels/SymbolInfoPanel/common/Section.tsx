import { DragSVG } from '@/components/icons';
import clsx from 'clsx';
import React, { useState } from 'react';

export interface ITabIem<T extends string = string> {
	id: T;
	title: string;
}

interface SectionProps<T extends string> {
	defaultActiveTab: T;
	tabs: Array<ITabIem<T>>;
	children?: React.ReactNode;
	onChange?: (tab: T) => void;
}

const Section = <T extends string = string>({ defaultActiveTab, tabs, children, onChange }: SectionProps<T>) => {
	const [activeTab, setActiveTab] = useState(defaultActiveTab);

	return (
		<div className='w-full overflow-hidden rounded bg-white'>
			<div
				style={{ flex: '0 0 4rem' }}
				className='overflow-hidden rounded-t bg-gray-200 pl-12 flex-justify-between'
			>
				<ul className='flex-1 flex-items-center'>
					{tabs.map((tab, index) => (
						<li style={{ flex: '0 0 12rem' }} key={tab.id}>
							<button
								onClick={() => setActiveTab(tab.id)}
								type='button'
								className={clsx(
									'relative h-40 w-full rounded-t text-base flex-justify-center',
									tab.id === activeTab ? 'bg-white font-medium text-gray-900' : 'text-gray-700',
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

				<button type='button' className='drag text-gray-700'>
					<DragSVG width='2rem' height='2rem' />
				</button>
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
