import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setOpenPositionProcessModal } from '@/features/slices/modalSlice';
import { type RootState } from '@/features/store';
import { useInputs } from '@/hooks';
import { createSelector } from '@reduxjs/toolkit';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Section from '../../common/Section';

const OpenPositionsProcessChart = dynamic(() => import('./OpenPositionsProcessChart'));

interface IOpenPositionProcessProps {
	isModal?: boolean;
}

interface IDefaultActiveTab {
	top: Dashboard.TInterval;
	bottom: Dashboard.GetOpenPositionProcess.TChartType;
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

	const { inputs: defaultTab, setFieldValue } = useInputs<IDefaultActiveTab>({
		top: 'Today',
		bottom: 'Aggregated',
	});

	return (
		<Section<Dashboard.TInterval, Dashboard.GetOpenPositionProcess.TChartType>
			id='open_positions_process'
			title={t('home.open_positions_process')}
			info={t('tooltip.open_position_process_section')}
			defaultTopActiveTab={defaultTab.top}
			defaultBottomActiveTab={defaultTab.bottom}
			onTopTabChange={(v) => setFieldValue('top', v)}
			onBottomTabChange={(v) => setFieldValue('bottom', v)}
			tabs={{
				top: [
					{ id: 'Today', title: t('home.tab_day') },
					{ id: 'Week', title: t('home.tab_week') },
					{ id: 'Month', title: t('home.tab_month') },
					{ id: 'Year', title: t('home.tab_year') },
				],
				bottom: [
					{ id: 'Aggregated', title: t('home.tab_aggregated') },
					{ id: 'Separated', title: t('home.tab_separated') },
				],
			}}
			expandable={!isModal}
			onExpand={() => dispatch(setOpenPositionProcessModal(getOpenPositionProcess ? null : {}))}
		>
			<OpenPositionsProcessChart interval={defaultTab.top} type={defaultTab.bottom} />
		</Section>
	);
};

export default OpenPositionsProcess;
