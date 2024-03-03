'use client';

import React, { useEffect, useState } from 'react';
import ErrorBoundary from '../common/ErrorBoundary';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

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
		<ErrorBoundary>
			<Header />
			<div style={{ height: 'calc(100vh - 4.8rem)' }} className='flex flex-1'>
				<Sidebar />
				<div className='h-full flex-1 justify-between flex-column'>
					<ErrorBoundary>{children}</ErrorBoundary>
					<Footer />
				</div>
			</div>
		</ErrorBoundary>
	);
};

export default Wrapper;
