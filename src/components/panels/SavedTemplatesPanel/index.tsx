'use client';

import Loading from '@/components/common/Loading';
import { useAppDispatch } from '@/features/hooks';
import { setSavedTemplatesPanel } from '@/features/slices/panelSlice';
import dynamic from 'next/dynamic';
import { forwardRef } from 'react';
import Panel from '../Panel';

const Container = dynamic(() => import('./Container'), {
	ssr: false,
	loading: () => <Loading />,
});

const SavedTemplates = forwardRef<HTMLDivElement>((_, ref) => {
	const dispatch = useAppDispatch();

	const onClose = () => {
		dispatch(setSavedTemplatesPanel(false));
	};

	return <Panel ref={ref} onClose={onClose} render={() => <Container close={onClose} />} width='42rem' />;
});

export default SavedTemplates;
