import SymbolSearch from '@/components/common/SymbolSearch';
import { openNewTab } from '@/utils/helpers';
import { useState } from 'react';

const SelectSymbol = () => {
	const [symbol] = useState<Symbol.Search | null>(null);

	const onChangeSymbol = (value: Symbol.Search | null) => {
		if (!value) return;

		openNewTab('/fa/saturn', `${value.isOption ? 'contractISIN' : 'symbolISIN'}=${value.symbolISIN}`);
	};

	return (
		<div
			style={{ maxWidth: '40rem' }}
			className='input-group h-40 flex-1 rounded border border-gray-500 flex-items-center'
		>
			<SymbolSearch value={symbol} onChange={onChangeSymbol} />
		</div>
	);
};

export default SelectSymbol;
