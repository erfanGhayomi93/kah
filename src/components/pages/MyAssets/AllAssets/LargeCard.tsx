import SwitchTab from '@/components/common/Tabs/SwitchTab';
import clsx from 'clsx';
import { memo } from 'react';

interface TabProps<T> {
	id: T;
	title: React.ReactNode;
}

interface LargeCardProps<T> extends React.HTMLAttributes<HTMLDivElement> {
	title: string;
	children?: React.ReactNode;
	tabs?: Array<TabProps<T>>;
	onTabChange?: (v: T) => void;
}

const LargeCard = <T extends string>({ title, tabs, children, style, onTabChange, ...props }: LargeCardProps<T>) => (
	<div {...props} style={{ height: '42.8rem', ...style }}>
		<div className='h-full gap-16 rounded pb-16 pl-8 pr-16 pt-8 shadow-card flex-column'>
			<div className='h-40 flex-justify-between'>
				<h2 className='text-lg font-medium text-gray-700'>{title}</h2>

				{Array.isArray(tabs) && tabs.length > 0 && (
					<SwitchTab<TabProps<T>>
						data={tabs}
						defaultActiveTab={tabs[0].id}
						classes={{
							root: '!h-40 bg-gray-100 !border-0 py-4 px-8',
							rect: 'bg-white dark:bg-gray-50 darkBlue:bg-gray-50 !h-32 rounded',
							tabs: 'gap-8',
						}}
						onChangeTab={(v) => onTabChange?.(v as T)}
						renderTab={(item, activeTab) => (
							<button
								type='button'
								className={clsx(
									'h-full flex-1 px-8 py-4 transition-colors',
									item.id === activeTab ? 'font-medium text-gray-800' : 'text-gray-500',
								)}
							>
								{item.title}
							</button>
						)}
					/>
				)}
			</div>

			{children}
		</div>
	</div>
);

export default memo(LargeCard, (prevProps, nextProps) => prevProps.children !== nextProps.children);
