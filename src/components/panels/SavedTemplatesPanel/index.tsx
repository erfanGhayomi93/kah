'use client';

import Loading from '@/components/common/Loading';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getSavedTemplatesPanel, setSavedTemplatesPanel } from '@/features/slices/panelSlice';
import dynamic from 'next/dynamic';
import PanelLoading from '../PanelLoading';

const Panel = dynamic(() => import('../Panel'), {
	ssr: false,
	loading: () => <PanelLoading />,
});

const Container = dynamic(() => import('./Container'), {
	ssr: false,
	loading: () => <Loading />,
});

const SavedTemplates = () => {
	const savedSaturnTemplates = useAppSelector(getSavedTemplatesPanel);

	const dispatch = useAppDispatch();

	const onClose = () => {
		dispatch(setSavedTemplatesPanel(false));
	};

	return (
		<Panel
			isEnable={savedSaturnTemplates}
			onClose={onClose}
			render={() => <Container close={onClose} />}
			width='42rem'
		/>
	);
};

export default SavedTemplates;
