import React from 'react';
import { ToastContainer } from 'react-toastify';

interface ToastRegistryProps {
	children: React.ReactNode;
}

const ToastRegistry = ({ children }: ToastRegistryProps) => {
	return (
		<>
			<ToastContainer
				hideProgressBar
				closeOnClick
				rtl
				theme='colored'
				position='bottom-left'
				toastClassName='shadow-sm'
				newestOnTop={false}
				closeButton={false}
				pauseOnFocusLoss={false}
				autoClose={2500}
				limit={3}
			/>
			{children}
		</>
	);
};

export default ToastRegistry;
