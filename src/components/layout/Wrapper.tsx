'use client';

import React, { Fragment, useEffect, useState } from 'react';
import Footer from './Footer';
import Header from './Header';

interface IWrapper {
	children: React.ReactNode;
}

const Wrapper = ({ children }: IWrapper) => {
	const [mount, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

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
