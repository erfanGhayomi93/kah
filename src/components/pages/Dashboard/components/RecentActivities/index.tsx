import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setRecentActivitiesModal } from '@/features/slices/modalSlice';
import { type RootState } from '@/features/store';
import { createSelector } from '@reduxjs/toolkit';
import { useTranslations } from 'next-intl';
import Section from '../../common/Section';

interface IRecentActivitiesProps {
	isModal?: boolean;
}

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		getRecentActivities: state.modal.recentActivities,
	}),
);

const RecentActivities = ({ isModal = false }: IRecentActivitiesProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { getRecentActivities } = useAppSelector(getStates);

	return (
		<Section
			id='recent_activities'
			title={t('home.recent_activities')}
			expandable={!isModal}
			onExpand={() => dispatch(setRecentActivitiesModal(getRecentActivities ? null : {}))}
		/>
	);
};

export default RecentActivities;
