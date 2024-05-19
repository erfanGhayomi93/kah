import Tabs from '@/components/common/Tabs/Tabs';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { type FC, useMemo } from 'react';
import { LiveDepositTab } from './LiveDepositTab';
import { ReceiptDepositTab } from './ReceiptDepositTab';

interface BodyDepositProps {
	dataEdit?: Reports.IDepositWithReceipt | Reports.IInstantDeposit,
	activeTab?: Payment.TDepositTab
}


function isReceiptDeposit(dataEdit?: Reports.IDepositWithReceipt | Reports.IInstantDeposit): dataEdit is Reports.IDepositWithReceipt {
	return (dataEdit as Reports.IDepositWithReceipt)?.receiptNumber !== undefined;
}


export const Body: FC<BodyDepositProps> = ({ dataEdit, activeTab }) => {

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
				render: () => <ReceiptDepositTab dataEdit={isReceiptDeposit(dataEdit) ? dataEdit : undefined} />,
			},
		],
		[],
	);

	return (
		<div className='h-full flex flex-column'>
			<Tabs
				data={TABS}
				defaultActiveTab={activeTab || 'liveDepositTab'}
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
