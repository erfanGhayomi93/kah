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
				render: () => <SettlementCashTab
					onCloseModal={onCloseModal}
					clickItemSettlement={clickItemSettlement}
				/>
			},
			{
				id: 'optionSettlementPhysicalTab',
				title: t('optionSettlementModal.physical_tab'),
				render: () => <SettlementPhysicalTab
					onCloseModal={onCloseModal}
					clickItemSettlement={clickItemSettlement}
				/>
			},
		],
		[],
	);


	return (
		<div className='h-full flex flex-column'>
			<Tabs
				data={TABS}
				defaultActiveTab='optionSettlementCashTab'
				// onChange={(id) => setTabSelected(id)}
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
