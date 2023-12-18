'use client';

import React, { useEffect, useState } from 'react';
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
		<div className='flex flex-col flex-1'>
			<Header />
			{children}
			<Footer />
		</div>
	);
};

export default Wrapper;
