import clsx from 'clsx';
import React, { useMemo } from 'react';
import styles from './Tab.module.scss';

export interface ITabIem<T> {
	disabled?: boolean;
	id: T;
	title: string | React.ReactNode;
	render: React.ReactNode;
}

interface TabProps<T> {
	activeTab: T;
	data: Array<ITabIem<T>>;
	onChange: (id: T) => void;
}

const Tab = <T extends unknown>({ activeTab, data, onChange }: TabProps<T>) => {
	const onChangeTab = (item: ITabIem<T>) => {
		onChange(item.id);
	};

	const render = useMemo(() => data.find((item) => item.id === activeTab)?.render ?? null, [activeTab, data]);

	return (
		<div className='w-full gap-16 pl-8 flex-column'>
			<ul className={styles.list}>
				{data.map((item, index) => (
					<li key={index}>
						<button
							type='button'
							onClick={() => onChangeTab(item)}
							disabled={Boolean(item.disabled)}
							className={clsx(styles.item, activeTab === item.id && styles.active)}
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
