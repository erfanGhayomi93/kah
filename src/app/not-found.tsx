'use client';

import Loading from '@/components/common/Loading';
import { useRouter } from '@/navigation';
import { useEffect } from 'react';

const NotFound = () => {
	const router = useRouter();

	useEffect(() => {
		router.push('/');
	}, []);

	return <Loading />;
};

export default NotFound;
