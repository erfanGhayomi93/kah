import clsx from 'clsx';
import React from 'react';

type TValue = string | React.ReactNode;

export interface ListItemProps {
	id: string;
	title: string;
	valueFormatter: (() => TValue) | TValue;
}

interface SymbolSummaryProps {
	data: Array<[ListItemProps, ListItemProps]>;
}

const ListItem = ({ title, valueFormatter }: ListItemProps) => (
	<div className='w-1/2 px-8 flex-justify-between'>
		<span className='whitespace-nowrap text-base text-gray-900'>{title}</span>
		<span className='text-base font-medium text-gray-1000 ltr'>
			{typeof valueFormatter === 'function' ? valueFormatter() : valueFormatter}
		</span>
	</div>
);

const SymbolSummary = ({ data }: SymbolSummaryProps) => {
	return (
		<ul className='flex flex-column'>
			{data.map(([firstItem, secondItem], i) => (
				<li key={firstItem.id} className={clsx('h-32 gap-16 flex-justify-between', i % 2 && 'bg-gray-200')}>
					<ListItem {...firstItem} />
					<ListItem {...secondItem} />
				</li>
			))}
		</ul>
	);
};

export default SymbolSummary;
