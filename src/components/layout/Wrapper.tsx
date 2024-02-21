'use client';

import React, { Fragment, useEffect, useState } from 'react';
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
		<Fragment>
			<Header />
			<div style={{ height: 'calc(100vh - 4.8rem)' }} className='flex flex-1'>
				<Sidebar />
				<div className='h-full flex-1 justify-between flex-column'>
					{children}
					<Footer />
				</div>
			</div>
		</Fragment>
	);
};

export default Wrapper;
