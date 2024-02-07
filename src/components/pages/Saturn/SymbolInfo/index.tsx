import MarketDepth from './MarketDepth';
import SymbolDetails from './SymbolDetails';

interface SymbolInfoProps {
	symbol: Symbol.Info;
	activeTab: Saturn.SymbolTab;
	setActiveTab: (tabId: Saturn.SymbolTab) => void;
}

const SymbolInfo = ({ symbol, activeTab, setActiveTab }: SymbolInfoProps) => {
	return (
		<div style={{ maxHeight: '37.6rem' }} className='flex w-full gap-56 rounded bg-white px-24 pb-16 pt-12'>
			<SymbolDetails symbol={symbol} />
			<MarketDepth symbol={symbol} activeTab={activeTab} setActiveTab={(tabId) => setActiveTab(tabId)} />
		</div>
	);
};

export default SymbolInfo;
