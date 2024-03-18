'use client';

import React, { useEffect, useState } from 'react';
import ErrorBoundary from '../common/ErrorBoundary';
import Footer from './Footer';
import Header from './Header';
import OrderBasket from './OrderBasket';
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

				<div style={{ paddingRight: '6rem' }} className='h-full flex-1 justify-between flex-column'>
					<ErrorBoundary>
						<Header />
					</ErrorBoundary>
					<ErrorBoundary>{children}</ErrorBoundary>
					<ErrorBoundary>
						<OrderBasket />
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
