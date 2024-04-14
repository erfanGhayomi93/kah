'use client';

import lightStreamInstance, { type Lightstream } from '@/classes/Lightstream';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setLsStatus } from '@/features/slices/uiSlice';
import { getIsLoggingIn } from '@/features/slices/userSlice';
import { useUserInfo } from '@/hooks';
import { useLayoutEffect, useRef } from 'react';

interface LightstreamRegistryProps {
	children: React.ReactNode;
}

const LightstreamRegistry = ({ children }: LightstreamRegistryProps) => {
	const lightstream = useRef<Lightstream | null>(null);

	const dispatch = useAppDispatch();

	const isLoggingIn = useAppSelector(getIsLoggingIn);

	const { data: userInfo, isLoading } = useUserInfo();

	const registerLightstream = () => {
		lightstream.current = lightStreamInstance
			.setUsername(userInfo?.nationalCode ?? null)
			.addEventListener('onStatusChange', (status) => {
				dispatch(setLsStatus(status as LightstreamStatus));
			})
			.start();
	};

	const updateLightstream = () => {
		if (!lightstream.current) return;
		lightstream.current.setUsername(userInfo?.nationalCode ?? null).restart();
	};

	useLayoutEffect(() => {
		if (isLoggingIn || isLoading) return;

		if (!lightstream.current) registerLightstream();
		else updateLightstream();
	}, [userInfo, isLoggingIn, isLoading]);

	return children;
};

export default LightstreamRegistry;
