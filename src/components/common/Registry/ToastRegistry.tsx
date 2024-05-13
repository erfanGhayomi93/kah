'use client'
import { useAppSelector } from '@/features/hooks';
import { getToastPosition } from '@/features/slices/uiSlice';
import React from 'react';
import { ToastContainer } from 'react-toastify';

interface ToastRegistryProps {
	children: React.ReactNode;
}

const ToastRegistry = ({ children }: ToastRegistryProps) => {
	const toastPosition = useAppSelector(getToastPosition);

	return (
		<>
			<ToastContainer
				hideProgressBar
				closeOnClick
				rtl
				theme='colored'
				position={toastPosition}
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
