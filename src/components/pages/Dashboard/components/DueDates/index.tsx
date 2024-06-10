import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setDueDatesModal } from '@/features/slices/modalSlice';
import { type RootState } from '@/features/store';
import { createSelector } from '@reduxjs/toolkit';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Section from '../../common/Section';

const DueDatesTable = dynamic(() => import('./DueDatesTable'));

interface IDueDatesProps {
	isModal?: boolean;
}

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		getDueDates: state.modal.dueDates,
	}),
);

const DueDates = ({ isModal = false }: IDueDatesProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { getDueDates } = useAppSelector(getStates);

	const [type, setType] = useState<Dashboard.GetOptionSettlementInfo.Type>('Closest');

	return (
		<Section<string, Dashboard.GetOptionSettlementInfo.Type>
			id='due_dates'
			title={t('home.due_dates')}
			info={t('tooltip.due_dates_section')}
			expandable={!isModal}
			onExpand={() => dispatch(setDueDatesModal(getDueDates ? null : {}))}
			defaultBottomActiveTab={type}
			onBottomTabChange={setType}
			tabs={{
				bottom: [
					{ id: 'Closest', title: t('home.tab_closest') },
					{ id: 'MostRecent', title: t('home.tab_newest') },
				],
			}}
		>
			<DueDatesTable type={type} />
		</Section>
	);
};

export default DueDates;
