import SymbolSearch from '@/components/common/Symbol/SymbolSearch';
import { useAppDispatch } from '@/features/hooks';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { useState } from 'react';

const SelectSymbol = () => {
	const dispatch = useAppDispatch();

	const [symbol] = useState<Symbol.Search | null>(null);

	const onChangeSymbol = (value: Symbol.Search | null) => {
		if (value?.symbolISIN) dispatch(setSymbolInfoPanel(value.symbolISIN));
	};

	return (
		<div style={{ maxWidth: '30rem' }} className='h-40 flex-1 flex-items-center'>
			<SymbolSearch value={symbol} onChange={onChangeSymbol} />
		</div>
	);
};

export default SelectSymbol;
