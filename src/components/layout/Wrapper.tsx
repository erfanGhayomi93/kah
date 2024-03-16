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
			<div className='flex h-screen'>
				<ErrorBoundary>
					<Sidebar />
				</ErrorBoundary>

				<div className='h-full flex-1 justify-between gap-8 flex-column'>
					<ErrorBoundary>
						<Header />
					</ErrorBoundary>
					<ErrorBoundary>{children}</ErrorBoundary>
					<ErrorBoundary>
						<Footer />
					</ErrorBoundary>
				</div>
			</div>
		</ErrorBoundary>
	);
};

export default Wrapper;
