'use client';

import lightStreamInstance from '@/classes/Lightstream';
import { useAppDispatch } from '@/features/hooks';
import { setLsStatus } from '@/features/slices/uiSlice';
import { useLayoutEffect } from 'react';

interface LightstreamRegistryProps {
	children: React.ReactNode;
}

const LightstreamRegistry = ({ children }: LightstreamRegistryProps) => {
	const dispatch = useAppDispatch();

	useLayoutEffect(() => {
		lightStreamInstance
			.addEventListener('onStatusChange', (status) => {
				dispatch(setLsStatus(status as LightstreamStatus));
			})
			.start();
	}, []);

	return children;
};

export default LightstreamRegistry;
