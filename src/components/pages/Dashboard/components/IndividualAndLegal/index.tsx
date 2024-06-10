import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setIndividualAndLegalModal } from '@/features/slices/modalSlice';
import { type RootState } from '@/features/store';
import { createSelector } from '@reduxjs/toolkit';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Section from '../../common/Section';
import IndividualAndLegalChart from './IndividualAndLegalChart';

interface IDefaultActiveTab {
	top: Dashboard.GetIndividualLegalInfo.SymbolType;
	bottom: Dashboard.GetIndividualLegalInfo.Type;
}

interface IIndividualAndLegalProps {
	isModal?: boolean;
}

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		getIndividualAndLegal: state.modal.individualAndLegal,
	}),
);

const IndividualAndLegal = ({ isModal = false }: IIndividualAndLegalProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { getIndividualAndLegal } = useAppSelector(getStates);

	const [defaultTab, setDefaultTab] = useState<IDefaultActiveTab>({
		top: 'Option',
		bottom: 'Legal',
	});

	const setDefaultTabByPosition = <T extends keyof IDefaultActiveTab>(position: T, value: IDefaultActiveTab[T]) => {
		setDefaultTab((prev) => ({
			...prev,
			[position]: value,
		}));
	};

	return (
		<Section<IDefaultActiveTab['top'], IDefaultActiveTab['bottom']>
			id='individual_and_legal'
			title={t('home.individual_and_legal')}
			info={t('tooltip.individual_and_legal_section')}
			defaultTopActiveTab={defaultTab.top}
			defaultBottomActiveTab={defaultTab.bottom}
			onTopTabChange={(v) => setDefaultTabByPosition('top', v)}
			onBottomTabChange={(v) => setDefaultTabByPosition('bottom', v)}
			tabs={{
				top: [
					{ id: 'Option', title: t('home.tab_option') },
					{ id: 'BaseSymbol', title: t('home.tab_base_symbol') },
				],
				bottom: [
					{ id: 'Legal', title: t('home.tab_legal_volume') },
					{ id: 'Individual', title: t('home.tab_individual_capita') },
				],
			}}
			expandable={!isModal}
			onExpand={() => dispatch(setIndividualAndLegalModal(getIndividualAndLegal ? null : {}))}
		>
			<IndividualAndLegalChart symbolType={defaultTab.top} type={defaultTab.bottom} />
		</Section>
	);
};

export default IndividualAndLegal;
