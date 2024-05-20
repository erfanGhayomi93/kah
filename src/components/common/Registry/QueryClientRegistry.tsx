// In Next.js, this file would be called: app/providers.jsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

interface QueryClientRegistryProps {
	children: React.ReactNode;
}

let browserQueryClient: QueryClient | undefined;

export const makeQueryClient = () => {
	return new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
				retry: false,
			},
		},
	});
};

const getQueryClient = () => {
	if (typeof window === 'undefined') return makeQueryClient();

	if (!browserQueryClient) browserQueryClient = makeQueryClient();

	return browserQueryClient;
};

const QueryClientRegistry = ({ children }: QueryClientRegistryProps) => {
	const queryClient = getQueryClient();
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default QueryClientRegistry;
