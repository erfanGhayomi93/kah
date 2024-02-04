'use client';

import Main from '@/components/layout/Main';
import { useLocalstorage } from '@/hooks';
import SelectSymbol from './SelectSymbol';
import SymbolContracts from './SymbolContracts';
import SymbolInfo from './SymbolInfo';

const OptionChain = () => {
	const [selectedSymbol, setSelectedSymbol] = useLocalstorage<null | string>('selected_symbol', null);

	return (
		<Main className='gap-8'>
			<div style={{ flex: '0 0 37.6rem' }} className='flex gap-8'>
				<SelectSymbol selectedSymbol={selectedSymbol} setSelectedSymbol={setSelectedSymbol} />
				<SymbolInfo selectedSymbol={selectedSymbol} />
			</div>

			<SymbolContracts selectedSymbol={selectedSymbol} />
		</Main>
	);
};

export default OptionChain;
