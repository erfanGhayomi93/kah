import IndividualAndLegal from './IndividualAndLegal';
import SymbolDetails from './SymbolDetails';
import SymbolTabs from './SymbolTabs';

interface SymbolInfoProps {
	symbol: Symbol.Info;
	activeTab: Saturn.SymbolTab;
	setActiveTab: (tabId: Saturn.SymbolTab) => void;
}

const SymbolInfo = ({ symbol, activeTab, setActiveTab }: SymbolInfoProps) => {
	return (
		<div
			style={{
				flex: '5',
			}}
			className='relative size-full flex-1 gap-24 overflow-y-auto overflow-x-hidden rounded bg-white px-16 pb-32 pt-16 flex-column'
		>
			<SymbolDetails symbol={symbol} />

			<div style={{ flex: '0 0 calc(50% - 1.8rem)' }} className='items-end gap-32 pl-16 flex-column'>
				<SymbolTabs symbol={symbol} activeTab={activeTab} setActiveTab={(tabId) => setActiveTab(tabId)} />
				<IndividualAndLegal symbol={symbol} />
			</div>
		</div>
	);
};

export default SymbolInfo;
