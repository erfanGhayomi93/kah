import Tabs from '@/components/common/Tabs/Tabs';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { type FC, useMemo } from 'react';
import { type TModePage } from '.';
import { SettlementCashTab } from './SettlementCashTab';
import { SettlementPhysicalTab } from './SettlementPhysicalTab';

interface PrimarySettlementTabProps {
	onCloseModal: () => void;
	clickItemSettlement: (item: Reports.TCashOrPhysicalSettlement) => void;
	modePage: TModePage;
	tabSelected: string;
	setTabSelected: React.Dispatch<React.SetStateAction<string>>;
}


export const PrimarySettlementTab: FC<PrimarySettlementTabProps> = ({ clickItemSettlement, modePage, tabSelected, setTabSelected }) => {
	const t = useTranslations();

	const TABS = useMemo(
		() => [
			{
				id: 'optionSettlementCashTab',
				title: t('optionSettlementModal.cash_tab'),
				render: () => (
					<SettlementCashTab clickItemSettlement={clickItemSettlement} />
				),
			},
			{
				id: 'optionSettlementPhysicalTab',
				title: t('optionSettlementModal.physical_tab'),
				render: () => (
					<SettlementPhysicalTab clickItemSettlement={clickItemSettlement} />
				),
			},
		],
		[modePage],
	);

	return (
		<div className='flex h-full flex-column'>
			<Tabs
				data={TABS}
				defaultActiveTab={tabSelected}
				onChange={(tab) => setTabSelected(tab)}
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
