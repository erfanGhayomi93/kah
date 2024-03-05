'use client';

import { useLayoutEffect } from 'react';

interface OMSMessagesProps {
	children: React.ReactNode;
}

const OMSMessages = ({ children }: OMSMessagesProps) => {
	useLayoutEffect(() => {
		//
	}, []);

	return children;
};

export default OMSMessages;
