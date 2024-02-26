import { NextIntlClientProvider, useMessages } from 'next-intl';
import React from 'react';

interface NextIntlClientRegistryProps {
	children: React.ReactNode;
}

const NextIntlClientRegistry = ({ children }: NextIntlClientRegistryProps) => {
	const messages = useMessages();

	return <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>;
};

export default NextIntlClientRegistry;
