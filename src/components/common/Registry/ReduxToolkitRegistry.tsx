'use client';

import { store } from '@/features/store';
import { useRef } from 'react';
import { Provider } from 'react-redux';

interface IReduxToolkitRegistryProps {
	children: React.ReactNode;
}

export const ReduxToolkitRegistry = ({ children }: IReduxToolkitRegistryProps) => {
	const storeRef = useRef(store);

	return <Provider store={storeRef.current}>{children}</Provider>;
};

export default ReduxToolkitRegistry;
