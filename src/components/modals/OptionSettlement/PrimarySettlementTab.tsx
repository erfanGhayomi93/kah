import Tabs from '@/components/common/Tabs/Tabs';
import { useAppSelector } from '@/features/hooks';
import { getOptionSettlementModal } from '@/features/slices/modalSlice';
import { type RootState } from '@/features/store';
import { createSelector } from '@reduxjs/toolkit';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { type FC, useMemo } from 'react';
import { SettlementCashTab } from './SettlementCashTab';
import { SettlementPhysicalTab } from './SettlementPhysicalTab';

interface PrimarySettlementTabProps {
	onCloseModal: () => void;
	clickItemSettlement: (item: Reports.TCashOrPhysicalSettlement) => void;
}

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		optionSettlement: getOptionSettlementModal(state),
	}),
);

export const PrimarySettlementTab: FC<PrimarySettlementTabProps> = ({ onCloseModal, clickItemSettlement }) => {
	const t = useTranslations();

	const { optionSettlement } = useAppSelector(getStates);

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
				defaultActiveTab={optionSettlement?.activeTab ?? ''}
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
