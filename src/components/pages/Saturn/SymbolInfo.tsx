interface SymbolInfoProps {
	symbol: Symbol.Info | null;
}

const SymbolInfo = ({ symbol }: SymbolInfoProps) => {
	return <div style={{ flex: '1 0 36rem' }} className='w-full rounded bg-white' />;
};

export default SymbolInfo;
