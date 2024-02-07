import Contract from './Contract';

interface SymbolContractsProps {
	baseSymbol: Symbol.Info;
	baseSymbolContracts: TSaturnBaseSymbolContracts;
	setBaseSymbol: (value: string) => void;
	setBaseSymbolContracts: (value: TSaturnBaseSymbolContracts) => void;
}

const SymbolContracts = ({
	baseSymbol,
	setBaseSymbol,
	baseSymbolContracts,
	setBaseSymbolContracts,
}: SymbolContractsProps) => {
	const onLoadContract = (contract: Symbol.Info) => {
		try {
			if (!contract.baseSymbolISIN) return;

			const { baseSymbolISIN, symbolISIN, symbolTitle, isOption } = contract;

			if (baseSymbolISIN === baseSymbol.symbolISIN || (baseSymbolISIN === null && isOption)) return;

			setBaseSymbol(baseSymbolISIN);
			setBaseSymbolContracts([
				{
					activeTab: 'price_information',
					symbolISIN,
					symbolTitle,
				},
				null,
				null,
				null,
			]);
		} catch (e) {
			//
		}
	};

	const onChangeContractTab = (tab: Saturn.OptionTab, index: number) => {
		try {
			const options = JSON.parse(JSON.stringify(baseSymbolContracts)) as typeof baseSymbolContracts;

			if (!options[index]) return;
			options[index]!.activeTab = tab;

			setBaseSymbolContracts(options);
		} catch (e) {
			//
		}
	};

	return (
		<div className='flex flex-wrap gap-8'>
			{baseSymbolContracts.map((option, index) => (
				<Contract
					key={index}
					option={option}
					baseSymbol={baseSymbol}
					onLoadContract={(contract) => onLoadContract(contract)}
					onChangeContractTab={(tab) => onChangeContractTab(tab, index)}
				/>
			))}
		</div>
	);
};

export default SymbolContracts;
