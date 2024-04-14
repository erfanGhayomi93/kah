import { useUserInfoQuery } from '@/api/queries/brokerPrivateQueries';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { useLayoutEffect } from 'react';

const useUserInfo = (): { data: Broker.User | null; isLoading: boolean } => {
	const brokerURLs = useAppSelector(getBrokerURLs);

	const { data, isLoading, refetch } = useUserInfoQuery({
		queryKey: ['userInfoQuery'],
		enabled: false,
	});

	useLayoutEffect(() => {
		if (brokerURLs) refetch();
	}, [JSON.stringify(brokerURLs)]);

	return {
		data: data ?? null,
		isLoading,
	};
};

export default useUserInfo;
