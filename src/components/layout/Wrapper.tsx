'use client';

import React, { useEffect, useState } from 'react';
import ErrorBoundary from '../common/ErrorBoundary';
import Footer from './Footer';
import Header from './Header';
import Orders from './Orders';
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
			<ErrorBoundary>
				<Header />
			</ErrorBoundary>
			<div style={{ height: 'calc(100dvh - 4.8rem)' }} className='flex flex-1'>
				<ErrorBoundary>
					<Sidebar />
				</ErrorBoundary>

				<div className='h-full flex-1 justify-between flex-column'>
					<ErrorBoundary>{children}</ErrorBoundary>
					<ErrorBoundary>
						<Orders />
					</ErrorBoundary>
					<ErrorBoundary>
						<Footer />
					</ErrorBoundary>
				</div>
			</div>
		</ErrorBoundary>
	);
};

export default Wrapper;
