import Contract from './Contract';

interface SymbolContractsProps {
	baseSymbol: Symbol.Info;
	baseSymbolContracts: TSaturnBaseSymbolContracts;
	setBaseSymbol: (value: string) => void;
	setBaseSymbolContracts: (value: TSaturnBaseSymbolContracts) => void;
}

const SymbolContracts = ({
	baseSymbol,
	baseSymbolContracts,
	setBaseSymbol,
	setBaseSymbolContracts,
}: SymbolContractsProps) => {
	const onLoadContract = (contract: Symbol.Info) => {
		try {
			if (!contract.baseSymbolISIN) return;

			if (contract.baseSymbolISIN === baseSymbol.symbolISIN) return;

			setBaseSymbol(contract.baseSymbolISIN);
			setBaseSymbolContracts([contract.symbolISIN, null, null, null]);
		} catch (e) {
			//
		}
	};

	return (
		<div className='flex flex-wrap gap-8'>
			{baseSymbolContracts.map((symbolISIN, index) => (
				<Contract
					key={index}
					symbolISIN={symbolISIN}
					baseSymbol={baseSymbol}
					onLoadContract={(baseSymbolISIN) => onLoadContract(baseSymbolISIN)}
				/>
			))}
		</div>
	);
};

export default SymbolContracts;
