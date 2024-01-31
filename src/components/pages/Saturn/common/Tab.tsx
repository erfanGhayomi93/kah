import clsx from 'clsx';
import React, { useMemo, useState } from 'react';

type TID = string;

export interface ITabIem {
	disabled?: boolean;
	id: TID;
	title: string | React.ReactNode;
	render: React.ReactNode;
}

interface TabProps {
	defaultActiveId?: TID;
	data: ITabIem[];
	onChange?: (id: TID) => void;
}

const Tab = ({ defaultActiveId, data, onChange }: TabProps) => {
	const [activeTab, setActiveTab] = useState<string>(defaultActiveId ?? data[0].id);

	const onChangeTab = (item: ITabIem) => {
		setActiveTab(item.id);
		if (onChange) onChange(item.id);
	};

	const render = useMemo(() => data.find((item) => item.id === activeTab)?.render ?? null, [activeTab, data]);

	return (
		<div className='w-full gap-16 pl-8 flex-column'>
			<ul className='flex gap-8 border-b border-gray-500'>
				{data.map((item) => (
					<li key={item.id}>
						<button
							type='button'
							onClick={() => onChangeTab(item)}
							disabled={Boolean(item.disabled)}
							className={clsx(
								'px-8 py-12',
								activeTab === item.id ? 'text-gray-1000 font-medium' : 'text-gray-900',
							)}
						>
							{item.title}
						</button>
					</li>
				))}
			</ul>

			{render}
		</div>
	);
};

export default Tab;
