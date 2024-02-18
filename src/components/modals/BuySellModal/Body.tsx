import Tabs from '@/components/common/Tabs';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface BodyProps extends IBsModalInputs {}

const Body = (props: BodyProps) => {
	const t = useTranslations();

	const TABS = useMemo(
		() => [
			{
				id: 'normal',
				title: t('bs_modal.normal_trade'),
				render: null,
			},
			{
				id: 'strategy',
				title: t('bs_modal.strategy'),
				render: null,
			},
		],
		[],
	);

	return (
		<div className='flex-1 px-16 flex-column'>
			<Tabs
				data={TABS}
				defaultActiveTab='normal'
				renderTab={(item, activeTab) => (
					<button
						className={clsx(
							'flex-1 pb-8 pt-12 transition-colors',
							item.id === activeTab ? 'font-medium text-gray-900' : 'text-gray-700',
						)}
						type='button'
					>
						{item.title}
					</button>
				)}
			/>
		</div>
	);
};

export default Body;
