interface SelectSymbolProps {
	selectedSymbol: null | Option.SymbolSearch;
	setSelectedSymbol: React.Dispatch<React.SetStateAction<Option.SymbolSearch | null>>;
}

const SelectSymbol = ({ selectedSymbol, setSelectedSymbol }: SelectSymbolProps) => {
	return <div style={{ flex: 1.4 }} className='rounded bg-white' />;
};

export default SelectSymbol;
