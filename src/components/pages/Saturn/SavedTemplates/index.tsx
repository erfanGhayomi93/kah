'use client';

import Loading from '@/components/common/Loading';
import Panel from '@/components/common/Panel';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getSavedSaturnTemplates, toggleSavedSaturnTemplates } from '@/features/slices/uiSlice';
import dynamic from 'next/dynamic';

const Container = dynamic(() => import('./Container'), {
	ssr: false,
	loading: () => <Loading />,
});

const SavedTemplates = () => {
	const dispatch = useAppDispatch();

	const isEnabled = useAppSelector(getSavedSaturnTemplates);

	const onClose = () => {
		dispatch(toggleSavedSaturnTemplates(false));
	};

	return <Panel isEnable={isEnabled} onClose={onClose} render={() => <Container close={onClose} />} width='42rem' />;
};

export default SavedTemplates;
