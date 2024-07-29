import NoData from '@/components/common/NoData';
import Tabs from '@/components/common/Tabs/Tabs';
import { FilterSVG } from '@/components/icons';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

const Notifications = () => {
	const t = useTranslations();

	const [activeTab, setActiveTab] = useState<string>('notifications');

	const TABS = useMemo(
		() => [
			{
				id: 'notifications',
				title: t('header_notifications.notifications'),
				render: () => <NoData />,
			},
			{
				id: 'messages',
				title: t('header_notifications.messages'),
				render: () => <NoData />,
			},
			{
				id: 'strategies',
				title: t('header_notifications.strategies'),
				render: () => <NoData />,
			},
		],
		[],
	);

	return (
		<div
			style={{ height: '80dvh', boxShadow: '0px 0px 12rem 0px rgba(0, 0, 0, 0.15)' }}
			className='darkBlue:bg-gray-50 rounded-md bg-white px-16 pb-16 shadow-tooltip flex-column dark:bg-gray-50'
		>
			<div className='h-56 flex-justify-end'>
				{activeTab === 'messages' && (
					<button type='button' className='text-gray-700'>
						<FilterSVG width='2.4rem' height='2.4rem' />
					</button>
				)}
			</div>

			<Tabs
				data={TABS}
				defaultActiveTab='notifications'
				onChange={setActiveTab}
				renderTab={(item, activeTab) => (
					<button
						className={clsx(
							'h-40 flex-1 transition-colors flex-justify-center',
							item.id === activeTab ? 'font-medium text-gray-700' : 'text-gray-500',
						)}
						type='button'
						disabled={item.disabled}
					>
						{item.title}
					</button>
				)}
			/>
		</div>
	);
};

export default Notifications;
