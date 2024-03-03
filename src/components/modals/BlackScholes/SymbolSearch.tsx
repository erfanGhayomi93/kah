import { useOptionBaseSymbolSearchQuery } from '@/api/queries/optionQueries';
import AsyncSelect from '@/components/common/Inputs/AsyncSelect';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface SymbolSearchProps {
	value: IBlackScholesModalStates['baseSymbol'];
	onChange: (symbol: IBlackScholesModalStates['baseSymbol']) => void;
}

const SymbolSearch = ({ value, onChange }: SymbolSearchProps) => {
	const t = useTranslations();

	const [term, setTerm] = useState('');

	const { data: symbolsData, isFetching } = useOptionBaseSymbolSearchQuery({
		queryKey: ['optionBaseSymbolSearchQuery', { term, orderBy: 'Alphabet' }],
		enabled: term.length > 1,
	});

	return (
		<AsyncSelect<Option.Search>
			options={symbolsData ?? []}
			term={term}
			value={value}
			loading={isFetching}
			minimumChars={2}
			blankPlaceholder={t('common.no_symbol_found')}
			placeholder={t('black_scholes_modal.base_symbol')}
			getOptionId={(option) => option!.symbolISIN}
			getOptionTitle={(option) => option!.symbolTitle}
			getInputValue={(option) => option!.symbolTitle}
			onChangeTerm={setTerm}
			onChange={onChange}
			classes={{
				root: '!h-48',
			}}
		/>
	);
};

export default SymbolSearch;
