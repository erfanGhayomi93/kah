import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setOptionContractModal } from '@/features/slices/modalSlice';
import { type RootState } from '@/features/store';
import { createSelector } from '@reduxjs/toolkit';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Section from '../../common/Section';

const OptionContractsContainer = dynamic(() => import('./OptionContractsContainer'));

interface IDefaultActiveTab {
	top: Dashboard.GetOptionContractAdditionalInfo.Basis;
	bottom: Dashboard.GetOptionContractAdditionalInfo.Type;
}

interface IOptionContractProps {
	isModal?: boolean;
}

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		getOptionContract: state.modal.optionContract,
	}),
);

const OptionContracts = ({ isModal = false }: IOptionContractProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { getOptionContract } = useAppSelector(getStates);

	const [defaultTab, setDefaultTab] = useState<IDefaultActiveTab>({
		top: 'Volume',
		bottom: 'ContractType',
	});

	const setDefaultTabByPosition = <T extends keyof IDefaultActiveTab>(position: T, value: IDefaultActiveTab[T]) => {
		setDefaultTab((prev) => ({
			...prev,
			[position]: value,
		}));
	};

	return (
		<Section<IDefaultActiveTab['top'], IDefaultActiveTab['bottom']>
			id='option_contracts'
			title={t('home.option_contracts')}
			info={t('tooltip.option_contract_section')}
			defaultTopActiveTab={defaultTab.top}
			defaultBottomActiveTab={defaultTab.bottom}
			onTopTabChange={(v) => setDefaultTabByPosition('top', v)}
			onBottomTabChange={(v) => setDefaultTabByPosition('bottom', v)}
			tabs={{
				top: [
					{ id: 'Volume', title: t('home.tab_volume') },
					{ id: 'Value', title: t('home.tab_value') },
				],
				bottom: [
					{ id: 'ContractType', title: t('home.tab_contract_type') },
					{ id: 'IOTM', title: t('home.tab_in_profit') },
				],
			}}
			closeable={!isModal}
			expandable={!isModal}
			onExpand={() => dispatch(setOptionContractModal(getOptionContract ? null : {}))}
		>
			<OptionContractsContainer type={defaultTab.bottom} basis={defaultTab.top} />
		</Section>
	);
};

export default OptionContracts;
