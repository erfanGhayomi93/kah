import SymbolMarketDepth from '@/components/common/Tables/SymbolMarketDepth';

interface ContractMarketDepthProps {
	symbol: Symbol.Info | null;
}

const ContractMarketDepth = ({ symbol }: ContractMarketDepthProps) => {
	if (!symbol) return null;

	return <SymbolMarketDepth symbolISIN={symbol.symbolISIN} />;
};

export default ContractMarketDepth;
