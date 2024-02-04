'use client';

import lightStreamInstance from '@/classes/Lightstream';
import { useAppDispatch } from '@/features/hooks';
import { setLsStatus } from '@/features/slices/uiSlice';
import { useLayoutEffect } from 'react';

interface LightstreamProviderProps {
	children: React.ReactNode;
}

const LightstreamProvider = ({ children }: LightstreamProviderProps) => {
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

export default LightstreamProvider;
