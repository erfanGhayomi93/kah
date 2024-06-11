import { useSymbolInfoQuery } from '@/api/queries/symbolQuery';
import NoData from '@/components/common/NoData';
import clsx from 'clsx';
import React from 'react';
import BaseSymbolTabs from './BaseSymbolTabs';
import BuyForm from './BuyForm';
import SymbolMainDetails from './SymbolMainDetails';

interface BuyBaseSymbolProps {
	bestLimitPrice: number;
	baseSymbolISIN: string;
	quantity: number;
	price: number;
	onSubmit: () => void;
	toggleExpand: (v: boolean) => void;
	setFieldValue: <K extends keyof CreateStrategy.CoveredCallInput>(
		name: K,
		value: CreateStrategy.CoveredCallInput[K],
	) => void;
}

interface WrapperProps {
	children?: React.ReactNode;
	className: string;
}

const BaseSymbolInfo = ({
	bestLimitPrice,
	baseSymbolISIN,
	quantity,
	price,
	onSubmit,
	setFieldValue,
}: BuyBaseSymbolProps) => {
	const { data: symbolData, isLoading: isLoadingSymbolData } = useSymbolInfoQuery({
		queryKey: ['symbolInfoQuery', baseSymbolISIN],
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
			<BuyForm
				bestLimitPrice={bestLimitPrice}
				quantity={quantity}
				validityDate='Day'
				price={price}
				marketUnit={symbolData.marketUnit}
				onSubmit={onSubmit}
				onChangePrice={(v) => setFieldValue('basePrice', v)}
			/>
		</Wrapper>
	);
};

const Wrapper = ({ children, className }: WrapperProps) => (
	<div style={{ flex: '0 0 39.6rem' }} className={clsx('relative rounded shadow-card', className)}>
		{children}
	</div>
);

export default BaseSymbolInfo;
