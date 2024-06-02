import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setMeetingsModal } from '@/features/slices/modalSlice';
import { type RootState } from '@/features/store';
import { createSelector } from '@reduxjs/toolkit';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Section from '../../common/Section';

const MeetingTable = dynamic(() => import('./MeetingTable'));

interface IMeetingsProps {
	isModal?: boolean;
}

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		getMeetings: state.modal.meetings,
	}),
);

const Meetings = ({ isModal = false }: IMeetingsProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { getMeetings } = useAppSelector(getStates);

	const [type, setType] = useState<Dashboard.GetAnnualReport.Type>('FundIncrease');

	return (
		<Section<string, Dashboard.GetAnnualReport.Type>
			id='meetings'
			title={t('home.meetings')}
			info={t('tooltip.meting_process_section')}
			defaultTopActiveTab={type}
			onBottomTabChange={setType}
			tabs={{
				bottom: [
					{ id: 'FundIncrease', title: t('home.tab_capital_increase') },
					{ id: 'Other', title: t('home.tab_another_meetings') },
				],
			}}
			closeable={!isModal}
			expandable={!isModal}
			onExpand={() => dispatch(setMeetingsModal(getMeetings ? null : {}))}
		>
			<MeetingTable type={type} />
		</Section>
	);
};

export default Meetings;
