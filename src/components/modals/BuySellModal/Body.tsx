import Tabs from '@/components/common/Tabs/Tabs';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import SimpleTrade from './SimpleTrade';

interface BodyProps extends IBsModalInputs {
	setInputValue: TSetBsModalInputs;
}

const Body = (props: BodyProps) => {
	const t = useTranslations();

	const TABS = useMemo(
		() => [
			{
				id: 'normal',
				title: t('bs_modal.normal_trade'),
				render: <SimpleTrade {...props} />,
			},
			{
				id: 'strategy',
				title: t('bs_modal.strategy'),
				render: null,
				disabled: true,
			},
		],
		[JSON.stringify(props)],
	);

	return (
		<div style={{ flex: '0 0 336px' }} className='gap-24 px-16 flex-column'>
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
						disabled={item.disabled}
					>
						{item.title}
					</button>
				)}
			/>
		</div>
	);
};

export default Body;
