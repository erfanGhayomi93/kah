'use client';

import { useLocalstorage } from '@/hooks';
import styled from 'styled-components';
import SelectSymbol from './SelectSymbol';
import SymbolContracts from './SymbolContracts';
import SymbolInfo from './SymbolInfo';

const Main = styled.main`
	display: flex;
	flex-direction: column;
	padding: 0.8rem 3.2rem 2.4rem 3.2rem;
	gap: 0.8rem;
	min-height: calc(100% - 10.8rem);
`;

const OptionChain = () => {
	const [selectedSymbol, setSelectedSymbol] = useLocalstorage<null | Option.SymbolSearch>('selected_symbol', null);

	return (
		<Main>
			<div style={{ flex: '0 0 37.6rem' }} className='flex gap-8'>
				<SelectSymbol selectedSymbol={selectedSymbol} setSelectedSymbol={setSelectedSymbol} />
				<SymbolInfo selectedSymbol={selectedSymbol} />
			</div>

			<SymbolContracts selectedSymbol={selectedSymbol} />
		</Main>
	);
};

export default OptionChain;
