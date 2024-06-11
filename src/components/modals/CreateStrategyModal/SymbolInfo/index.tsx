import { useSymbolInfoQuery } from '@/api/queries/symbolQuery';
import NoData from '@/components/common/NoData';
import clsx from 'clsx';
import React from 'react';
import BaseSymbolTabs from '../SymbolInfo/BaseSymbolTabs';
import SymbolMainDetails from '../SymbolInfo/SymbolMainDetails';

interface SymbolInfoProps {
	symbolISIN: string;
	children: (symbolData: Symbol.Info) => React.ReactNode;
}

interface WrapperProps {
	children?: React.ReactNode;
	className: string;
}

const SymbolInfo = ({ symbolISIN, children }: SymbolInfoProps) => {
	const { data: symbolData, isLoading: isLoadingSymbolData } = useSymbolInfoQuery({
		queryKey: ['symbolInfoQuery', symbolISIN],
	});

	if (isLoadingSymbolData) return <Wrapper className='skeleton' />;

	if (!symbolData) {
		return (
			<Wrapper className='bg-white'>
				<NoData />
			</Wrapper>
		);
	}

	return (
		<Wrapper className='gap-8 bg-white px-16 py-20 flex-column'>
			<SymbolMainDetails {...symbolData} />
			<BaseSymbolTabs symbolData={symbolData} isLoading={isLoadingSymbolData} />
			{children(symbolData)}
		</Wrapper>
	);
};

const Wrapper = ({ children, className }: WrapperProps) => (
	<div style={{ flex: '0 0 39.6rem' }} className={clsx('relative rounded shadow-card', className)}>
		{children}
	</div>
);

export default SymbolInfo;
