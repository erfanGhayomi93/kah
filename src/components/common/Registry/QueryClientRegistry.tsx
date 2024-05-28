// In Next.js, this file would be called: app/providers.jsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

interface QueryClientRegistryProps {
	children: React.ReactNode;
}

export let browserQueryClient: QueryClient | undefined;

export let brokerQueryClient: QueryClient | undefined;

const makeQueryClient = () => {
	return new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
				retry: false,
			},
		},
	});
};

const getBrowserQueryClient = () => {
	if (typeof window === 'undefined') return makeQueryClient();

	if (!browserQueryClient) browserQueryClient = makeQueryClient();

	return browserQueryClient;
};

const getBrokerQueryClient = () => {
	if (typeof window === 'undefined') return makeQueryClient();

	if (!browserQueryClient) browserQueryClient = makeQueryClient();

	return browserQueryClient;
};

const QueryClientRegistry = ({ children }: QueryClientRegistryProps) => {
	const appQueryClient = getBrowserQueryClient();
	const brokerQueryClient = getBrokerQueryClient();

	return (
		<QueryClientProvider client={appQueryClient}>
			<QueryClientProvider client={brokerQueryClient}>{children}</QueryClientProvider>
		</QueryClientProvider>
	);
};

export default QueryClientRegistry;
