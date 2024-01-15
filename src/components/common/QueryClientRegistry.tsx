'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

interface IQueryClientRegistryProps {
	children: React.ReactNode;
}

export const QueryClientRegistry = ({ children }: IQueryClientRegistryProps) => {
	const [queryClient] = useState(() => new QueryClient());

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default QueryClientRegistry;
