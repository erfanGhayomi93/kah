'use client';

import { useTranslations } from 'next-intl';
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
	const t = useTranslations('common');

	const [mount, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mount) return null;

	return (
		<ErrorBoundary>
			<div className='fixed left-0 top-0 flex size-full items-center justify-center bg-white text-center md:hidden'>
				<h2 className='text-lg font-medium'>{t('does_not_support_mobile')}</h2>
			</div>

			<div className='hidden h-screen md:flex'>
				<ErrorBoundary>
					<Sidebar />
				</ErrorBoundary>

				<div
					style={{ paddingRight: '6rem' }}
					className='h-full flex-1 justify-between overflow-hidden flex-column'
				>
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
