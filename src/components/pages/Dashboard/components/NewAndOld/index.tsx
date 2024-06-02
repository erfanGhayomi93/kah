import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setNewAndOldModal } from '@/features/slices/modalSlice';
import { type RootState } from '@/features/store';
import { createSelector } from '@reduxjs/toolkit';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Section from '../../common/Section';

const NewAndOldTable = dynamic(() => import('./NewAndOldTable'));

interface INewAndOldProps {
	isModal?: boolean;
}

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		getNewAndOld: state.modal.newAndOld,
	}),
);

const NewAndOld = ({ isModal = false }: INewAndOldProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { getNewAndOld } = useAppSelector(getStates);

	const [type, setType] = useState<Dashboard.TNewAndOld>('FirstTradedOptionSymbol');

	return (
		<Section<string, Dashboard.TNewAndOld>
			id='new_and_old'
			title={t('home.new_and_old')}
			info={isModal ? '' : t('tooltip.new_and_old_section')}
			defaultTopActiveTab={type}
			onBottomTabChange={setType}
			tabs={{
				bottom: [
					{ id: 'FirstTradedOptionSymbol', title: t('home.tab_new_trades') },
					{ id: 'MostTradedOptionSymbol', title: t('home.tab_most_trading_day') },
				],
			}}
			closeable={!isModal}
			expandable
			onExpand={() => dispatch(setNewAndOldModal(getNewAndOld ? null : {}))}
		>
			<NewAndOldTable type={type} />
		</Section>
	);
};

export default NewAndOld;
