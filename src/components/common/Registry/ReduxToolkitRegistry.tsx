'use client';

import { store } from '@/features/store';
import { Provider } from 'react-redux';

interface IReduxToolkitRegistryProps {
	children: React.ReactNode;
}

export const ReduxToolkitRegistry = ({ children }: IReduxToolkitRegistryProps) => {
	return <Provider store={store}>{children}</Provider>;
};

export default ReduxToolkitRegistry;
