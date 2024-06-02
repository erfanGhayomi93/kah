import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setTopBaseAssetsModal } from '@/features/slices/modalSlice';
import { type RootState } from '@/features/store';
import { createSelector } from '@reduxjs/toolkit';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Section from '../../common/Section';

const TopBaseAssetsTable = dynamic(() => import('./TopBaseAssetsTable'));

interface ITopBaseAssetsProps {
	isModal?: boolean;
}

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		getTopBaseAssets: state.modal.topBaseAssets,
	}),
);

const TopBaseAssets = ({ isModal = false }: ITopBaseAssetsProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { getTopBaseAssets } = useAppSelector(getStates);

	return (
		<Section
			id='top_base_assets'
			title={t('home.top_base_assets')}
			info={isModal ? '' : t('tooltip.top_base_assets_section')}
			closeable={!isModal}
			expandable
			onExpand={() => dispatch(setTopBaseAssetsModal(getTopBaseAssets ? null : {}))}
		>
			<TopBaseAssetsTable />
		</Section>
	);
};

export default TopBaseAssets;
