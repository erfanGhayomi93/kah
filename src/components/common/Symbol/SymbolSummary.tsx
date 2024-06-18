import { cn } from '@/utils/helpers';
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
		<span className='text-light-gray-700 whitespace-nowrap text-base'>{title}</span>
		<span className='text-light-gray-800 text-base font-medium ltr'>
			{typeof valueFormatter === 'function' ? valueFormatter() : valueFormatter}
		</span>
	</div>
);

const SymbolSummary = ({ data }: SymbolSummaryProps) => {
	return (
		<ul className='flex flex-column'>
			{data.map(([firstItem, secondItem]) => (
				<li key={firstItem.id} className={cn('odd:bg-light-gray-100 h-32 gap-16 flex-justify-between')}>
					<ListItem {...firstItem} />
					<ListItem {...secondItem} />
				</li>
			))}
		</ul>
	);
};

export default SymbolSummary;
