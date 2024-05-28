import Tabs from '@/components/common/Tabs/Tabs';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { type FC, useMemo } from 'react';
import { SettlementCashTab } from './SettlementCashTab';
import { SettlementPhysicalTab } from './SettlementPhysicalTab';

interface PrimarySettlementTabProps {
	onCloseModal: () => void;
	clickItemSettlement: (item: Reports.TCashOrPhysicalSettlement) => void;
}

export const PrimarySettlementTab: FC<PrimarySettlementTabProps> = ({ onCloseModal, clickItemSettlement }) => {
	const t = useTranslations();

	const TABS = useMemo(
		() => [
			{
				id: 'optionSettlementCashTab',
				title: t('optionSettlementModal.cash_tab'),
				render: () => (
					<SettlementCashTab onCloseModal={onCloseModal} clickItemSettlement={clickItemSettlement} />
				),
			},
			{
				id: 'optionSettlementPhysicalTab',
				title: t('optionSettlementModal.physical_tab'),
				render: () => (
					<SettlementPhysicalTab onCloseModal={onCloseModal} clickItemSettlement={clickItemSettlement} />
				),
			},
		],
		[],
	);

	return (
		<div className='flex h-full flex-column'>
			<Tabs
				data={TABS}
				defaultActiveTab='optionSettlementCashTab'
				// onChange={(id) => setTabSelected(id)}
				renderTab={(item, activeTab) => (
					<button
						className={clsx(
							'h-40 flex-1 px-16 text-center transition-colors flex-justify-center',
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
