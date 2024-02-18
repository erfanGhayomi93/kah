import SymbolPriceTable from '@/components/common/Tables/SymbolPriceTable';

interface ContractMarketDepthProps {
	symbol: Symbol.Info | null;
}

const ContractMarketDepth = ({ symbol }: ContractMarketDepthProps) => {
	if (!symbol) return null;

	return <SymbolPriceTable symbolISIN={symbol.symbolISIN} />;
};

export default ContractMarketDepth;
