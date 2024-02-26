'use client';

import { useGetBrokerUrlQuery } from '@/api/queries/commonQueries';
import { useAppSelector } from '@/features/hooks';
import { getBrokerIsSelected } from '@/features/slices/userSlice';
import { useLayoutEffect } from 'react';

interface AppMiddlewareProps {
	children: React.ReactNode;
}

const AppMiddleware = ({ children }: AppMiddlewareProps) => {
	const brokerIsSelected = useAppSelector(getBrokerIsSelected);

	const { data: brokerUrls } = useGetBrokerUrlQuery({
		queryKey: ['getBrokerUrlQuery'],
	});

	useLayoutEffect(() => {
		if (!brokerIsSelected || !brokerUrls) return;

		console.log(brokerUrls);
	}, [brokerIsSelected, brokerUrls]);

	return children;
};

export default AppMiddleware;
