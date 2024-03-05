import SymbolDetails from './SymbolDetails';
import SymbolTabs from './SymbolTabs';

interface SymbolInfoProps {
	symbol: Symbol.Info;
	activeTab: Saturn.SymbolTab;
	setActiveTab: (tabId: Saturn.SymbolTab) => void;
}

const SymbolInfo = ({ symbol, activeTab, setActiveTab }: SymbolInfoProps) => {
	return (
		<>
			<SymbolDetails symbol={symbol} />
			<SymbolTabs symbol={symbol} activeTab={activeTab} setActiveTab={(tabId) => setActiveTab(tabId)} />
		</>
	);
};

export default SymbolInfo;
