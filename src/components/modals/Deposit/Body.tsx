import Tabs from '@/components/common/Tabs/Tabs';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';
import { type FC, useMemo } from 'react';
import { LiveDepositTab } from './LiveDepositTab';
import { ReceiptDepositTab } from './ReceiptDepositTab';

interface BodyDepositProps {
	dataEdit?: Reports.IDepositWithReceipt | Reports.IInstantDeposit;
	activeTab?: Payment.TDepositTab;
	setActiveTab: (v: Payment.TDepositTab) => void;
}

function isReceiptDeposit(
	dataEdit?: Reports.IDepositWithReceipt | Reports.IInstantDeposit,
): dataEdit is Reports.IDepositWithReceipt {
	return (dataEdit as Reports.IDepositWithReceipt)?.receiptNumber !== undefined;
}

export const Body: FC<BodyDepositProps> = ({ dataEdit, activeTab, setActiveTab }) => {
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
		<div className='h-full gap-24 flex-column'>
			<Tabs
				data={TABS}
				defaultActiveTab={activeTab || 'liveDepositTab'}
				onChange={(tab) => setActiveTab(tab as Payment.TDepositTab)}
				renderTab={(item, activeTab) => (
					<button
						className={clsx(
							'h-40 flex-1 px-16 text-center transition-colors flex-justify-center',
							item.id === activeTab ? 'font-medium text-gray-700' : 'text-gray-500',
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
