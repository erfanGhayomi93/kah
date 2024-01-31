import SymbolSearch from '@/components/common/SymbolSearch';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SelectSymbol = () => {
	const router = useRouter();

	const [symbol] = useState<Symbol.Search | null>(null);

	const onChangeSymbol = (value: Symbol.Search | null) => {
		if (!value) return;

		router.push(`/fa/saturn?${value.isOption ? 'contractISIN' : 'symbolISIN'}=${value.symbolISIN}`);
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
