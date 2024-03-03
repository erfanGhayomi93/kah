import { useOptionBaseSymbolSearchQuery } from '@/api/queries/optionQueries';
import AsyncSelect from '@/components/common/Inputs/AsyncSelect';
import { englishToPersian } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useLayoutEffect, useMemo, useState } from 'react';

interface SymbolSearchProps {
	value: IBlackScholesModalStates['baseSymbol'];
	onChange: (symbol: IBlackScholesModalStates['baseSymbol']) => void;
}

const SymbolSearch = ({ value, onChange }: SymbolSearchProps) => {
	const t = useTranslations();

	const [term, setTerm] = useState('');

	const {
		data: symbolsData,
		isLoading,
		refetch,
	} = useOptionBaseSymbolSearchQuery({
		queryKey: ['optionBaseSymbolSearchQuery', { term: '', orderBy: 'Alphabet' }],
		enabled: false,
	});

	const data = useMemo(() => {
		if (!term || !Array.isArray(symbolsData)) return symbolsData ?? [];

		return symbolsData.filter((s) => s.symbolTitle.includes(englishToPersian(term)));
	}, [term, symbolsData]);

	useLayoutEffect(() => {
		refetch();
	}, []);

	return (
		<AsyncSelect<Option.Search>
			options={data}
			term={term}
			value={value}
			loading={isLoading}
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
