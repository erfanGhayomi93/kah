import Contract from './Contract';

interface SymbolContractsProps {
	baseSymbol: Symbol.Info;
	baseSymbolContracts: TSaturnBaseSymbolContracts;
	onChange: (value: TSaturnBaseSymbolContracts) => void;
}

const SymbolContracts = ({ baseSymbol, baseSymbolContracts, onChange }: SymbolContractsProps) => {
	const onChangeContract = (index: number, symbol: string | null) => {
		try {
			if (index > 3) return;

			const symbols: TSaturnBaseSymbolContracts = [...baseSymbolContracts];
			symbols[index] = symbol;

			onChange(symbols);
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
					onChange={(value) => onChangeContract(index, value)}
					baseSymbol={baseSymbol}
				/>
			))}
		</div>
	);
};

export default SymbolContracts;
