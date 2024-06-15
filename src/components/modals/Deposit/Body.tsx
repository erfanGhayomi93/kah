import Tabs from '@/components/common/Tabs/Tabs';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { type FC, useMemo } from 'react';
import { LiveDepositTab } from './LiveDepositTab';
import { ReceiptDepositTab } from './ReceiptDepositTab';

interface BodyDepositProps {
	dataEdit?: Reports.IDepositWithReceipt | Reports.IInstantDeposit;
	activeTab?: Payment.TDepositTab;
}

function isReceiptDeposit(
	dataEdit?: Reports.IDepositWithReceipt | Reports.IInstantDeposit,
): dataEdit is Reports.IDepositWithReceipt {
	return (dataEdit as Reports.IDepositWithReceipt)?.receiptNumber !== undefined;
}

export const Body: FC<BodyDepositProps> = ({ dataEdit, activeTab }) => {
	const t = useTranslations();

	const TABS = useMemo(
		() => [
			{
				id: 'liveDepositTab',
				title: t('deposit_modal.liveDepositTab'),
				render: () => <LiveDepositTab />,
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
		<div className='flex h-full flex-column'>
			<Tabs
				data={TABS}
				defaultActiveTab={activeTab || 'liveDepositTab'}
				renderTab={(item, activeTab) => (
					<button
						className={clsx(
							'h-40 flex-1 px-16 text-center transition-colors flex-justify-center',
							item.id === activeTab ? 'text-light-gray-700 font-medium' : 'text-light-gray-500',
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
