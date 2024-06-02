import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setOpenPositionProcessModal } from '@/features/slices/modalSlice';
import { type RootState } from '@/features/store';
import { createSelector } from '@reduxjs/toolkit';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Section from '../../common/Section';

const OpenPositionsProcessChart = dynamic(() => import('./OpenPositionsProcessChart'));

interface IOpenPositionProcessProps {
	isModal?: boolean;
}

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		getOpenPositionProcess: state.modal.openPositionProcess,
	}),
);

const OpenPositionsProcess = ({ isModal = false }: IOpenPositionProcessProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { getOpenPositionProcess } = useAppSelector(getStates);

	const [interval, setInterval] = useState<Dashboard.TInterval>('Today');

	return (
		<Section<Dashboard.TInterval>
			id='open_positions_process'
			title={t('home.open_positions_process')}
			info={isModal ? '' : t('tooltip.open_position_process_section')}
			defaultTopActiveTab={interval}
			onTopTabChange={setInterval}
			tabs={{
				top: [
					{ id: 'Today', title: t('home.tab_day') },
					{ id: 'Week', title: t('home.tab_week') },
					{ id: 'Month', title: t('home.tab_month') },
					{ id: 'Year', title: t('home.tab_year') },
				],
			}}
			closeable={!isModal}
			expandable
			onExpand={() => dispatch(setOpenPositionProcessModal(getOpenPositionProcess ? null : {}))}
		>
			<OpenPositionsProcessChart interval={interval} />
		</Section>
	);
};

export default OpenPositionsProcess;
