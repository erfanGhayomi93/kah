import { useOptionBaseSymbolSearchQuery } from '@/api/queries/optionQueries';
import AsyncSelect from '@/components/common/Inputs/AsyncSelect';
import { useState } from 'react';

interface SymbolSearchProps {
	value: IBlackScholesModalStates['baseSymbol'];
	placeholder: string;
	onChange: (symbol: IBlackScholesModalStates['baseSymbol']) => void;
}

const SymbolSearch = ({ value, placeholder, onChange }: SymbolSearchProps) => {
	const [term, setTerm] = useState('');

	const { data: symbolsData, isFetching } = useOptionBaseSymbolSearchQuery({
		queryKey: ['optionBaseSymbolSearchQuery', { term, orderBy: 'Alphabet' }],
		enabled: term.length > 1,
	});

	return (
		<AsyncSelect<Option.Search>
			options={symbolsData ?? []}
			value={value}
			loading={isFetching}
			label={placeholder}
			term={term}
			getOptionId={(option) => option!.symbolISIN}
			getOptionTitle={(option) => option!.symbolTitle}
			onChangeTerm={(v) => setTerm(v)}
			onChange={onChange}
			classes={{
				root: '!h-48',
			}}
		/>
	);
};

export default SymbolSearch;
