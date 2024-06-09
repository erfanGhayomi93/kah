import { useSymbolInfoQuery } from '@/api/queries/symbolQuery';
import NoData from '@/components/common/NoData';
import clsx from 'clsx';
import React from 'react';
import SymbolMainDetails from './SymbolMainDetails';

interface BuyBaseSymbolProps {
	baseSymbolISIN: string;
}

interface WrapperProps {
	children?: React.ReactNode;
	className: string;
}

const BaseSymbolInfo = ({ baseSymbolISIN }: BuyBaseSymbolProps) => {
	const { data: symbolData, isLoading } = useSymbolInfoQuery({
		queryKey: ['symbolInfoQuery', baseSymbolISIN],
	});

	if (isLoading) return <Wrapper className='skeleton' />;

	if (!symbolData)
		return (
			<Wrapper className='bg-white'>
				<NoData />
			</Wrapper>
		);

	return (
		<Wrapper className='bg-white px-16 py-20'>
			<SymbolMainDetails {...symbolData} />
		</Wrapper>
	);
};

const Wrapper = ({ children, className }: WrapperProps) => (
	<div style={{ flex: '0 0 39.6rem' }} className={clsx('relative rounded shadow-card', className)}>
		{children}
	</div>
);

export default BaseSymbolInfo;
