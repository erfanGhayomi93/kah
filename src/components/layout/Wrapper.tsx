'use client';

import { useUserInformationQuery } from '@/api/queries/userQueries';
import { useAppDispatch } from '@/features/hooks';
import { setLoggedIn } from '@/features/slices/userSlice';
import React, { Fragment, useEffect, useState } from 'react';
import Footer from './Footer';
import Header from './Header';

interface IWrapper {
	children: React.ReactNode;
}

const Wrapper = ({ children }: IWrapper) => {
	const [mount, setMounted] = useState(false);

	const dispatch = useAppDispatch();

	const { data: userData } = useUserInformationQuery({
		queryKey: ['userInformationQuery'],
	});

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (userData) dispatch(setLoggedIn(true));
	}, [userData]);

	if (!mount) return null;

	return (
		<Fragment>
			<Header />
			{children}
			<Footer />
		</Fragment>
	);
};

export default Wrapper;
