import { useOptionSymbolSearchQuery } from '@/api/queries/optionQueries';
import AsyncSelect from '@/components/common/Inputs/AsyncSelect';
import { englishToPersian, sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

interface SymbolSearchProps {
	basis: 'base' | 'contract';
	value: IBlackScholesModalStates['contract'];
	isLoading: boolean;
	disabled: boolean;
	options: Option.Root[];
	onChange: (symbol: IBlackScholesModalStates['contract']) => void;
}

const ContractSearch = ({ basis, value, disabled, isLoading, options, onChange }: SymbolSearchProps) => {
	const t = useTranslations();

	const [term, setTerm] = useState('');

	const { data: optionData, isLoading: isLoadingOptionData } = useOptionSymbolSearchQuery({
		queryKey: ['optionSymbolSearchQuery', term],
		enabled: basis === 'contract',
	});

	const onSelect = (symbol: Option.Root | Option.CustomWatchlistSearch) => {
		if ('symbolInfo' in symbol) onChange(symbol);
		else {
			//
		}
	};

	const data = useMemo(() => {
		if (basis === 'contract') return optionData ?? [];

		if (!term) return options;
		return options.filter((o) => o.symbolInfo.symbolTitle.includes(englishToPersian(term)));
	}, [term, basis, optionData, options]);

	return (
		<AsyncSelect<Option.Root | Option.CustomWatchlistSearch>
			options={data}
			value={value}
			term={term}
			disabled={basis === 'base' && disabled}
			loading={basis === 'base' ? isLoading : isLoadingOptionData}
			blankPlaceholder={t('black_scholes_modal.no_contract_found')}
			placeholder={t('black_scholes_modal.contract')}
			getOptionId={(option) => ('symbolInfo' in option ? option.symbolInfo!.symbolISIN : option.symbolISIN)}
			getOptionTitle={(option) => {
				if (!option) return null;

				if ('symbolInfo' in option) {
					return (
						<div className='w-full flex-1 flex-justify-between'>
							<span>{option.symbolInfo.symbolTitle}</span>
							<span>{sepNumbers(String(option!.symbolInfo.strikePrice))}</span>
						</div>
					);
				}

				return (
					<div className='w-full flex-1 flex-justify-between'>
						<span>{option.symbolTitle}</span>
					</div>
				);
			}}
			onChange={onSelect}
			onChangeTerm={setTerm}
			classes={{
				root: '!h-48',
			}}
		/>
	);
};

export default ContractSearch;
