import Tabs from '@/components/common/Tabs/Tabs';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { LiveDepositTab } from './LiveDepositTab';
import { ReceiptDepositTab } from './ReceiptDepositTab';


export const Body = () => {

	const t = useTranslations();

	const TABS = useMemo(
		() => [
			{
				id: 'liveDepositTab',
				title: t('deposit_modal.liveDepositTab'),
				render: () => <LiveDepositTab />
			},
			{
				id: 'receiptDepositTab',
				title: t('deposit_modal.receiptDepositTab'),
				render: () => <ReceiptDepositTab />
			},
		],
		[],
	);

	return (
		<div className='h-full flex flex-column'>
			<Tabs
				data={TABS}
				defaultActiveTab='liveDepositTab'
				renderTab={(item, activeTab) => (
					<button
						className={clsx(
							'h-40 px-16 transition-colors flex-justify-center text-center flex-1',
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
