import { useOptionBaseSymbolSearchQuery } from '@/api/queries/optionQueries';
import AsyncSelect, { type AsyncSelectProps } from '@/components/common/Inputs/AsyncSelect';
import { englishToPersian } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

type BaseSymbolSearchProps = Partial<Omit<AsyncSelectProps<Option.BaseSearch>, 'value' | 'onChange'>> & {
	nullable?: boolean;
	value: IBlackScholesModalStates['baseSymbol'];
	onChange: (symbol: IBlackScholesModalStates['baseSymbol']) => void;
};

const BaseSymbolSearch = ({ value, nullable = true, onChange, ...props }: BaseSymbolSearchProps) => {
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

	useEffect(() => {
		refetch();
	}, []);

	useEffect(() => {
		if (!nullable && !value && Array.isArray(symbolsData) && symbolsData.length > 0) {
			onChange(symbolsData[0]);
		}
	}, [nullable, symbolsData]);

	return (
		<AsyncSelect<Option.BaseSearch>
			value={value}
			onChange={onChange}
			options={data}
			term={term}
			loading={isLoading}
			blankPlaceholder={t('common.symbol_not_found')}
			placeholder={t('symbol_search.base_symbol')}
			getOptionId={(option) => option!.symbolISIN}
			getOptionTitle={(option) => option!.symbolTitle}
			onChangeTerm={setTerm}
			{...props}
		/>
	);
};

export default BaseSymbolSearch;
