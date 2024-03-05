import axios from '@/api/axios';
import { useOptionSymbolSearchQuery } from '@/api/queries/optionQueries';
import routes from '@/api/routes';
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

	const [isLoadingOption, setIsLoadingOption] = useState(true);

	const { data: optionData, isLoading: isLoadingOptionData } = useOptionSymbolSearchQuery({
		queryKey: ['optionSymbolSearchQuery', term],
		enabled: basis === 'contract',
	});

	const onSelect = async (symbol: Option.Root | Option.Search) => {
		if ('symbolInfo' in symbol) onChange(symbol);
		else {
			setIsLoadingOption(true);

			try {
				const response = await axios.get<ServerResponse<Symbol.Info>>(routes.symbol.SymbolInfo, {
					params: { symbolIsin: symbol.symbolISIN },
				});
				const { data } = response;

				if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

				// if (data.result) onChange(data.result);
			} catch (e) {
				//
			} finally {
				setIsLoadingOption(false);
			}
		}
	};

	const data = useMemo(() => {
		if (basis === 'contract') return optionData ?? [];

		if (!term) return options;
		return options.filter((o) => o.symbolInfo.symbolTitle.includes(englishToPersian(term)));
	}, [term, basis, optionData, options]);

	return (
		<div className='relative flex-1'>
			<AsyncSelect<Option.Root | Option.Search>
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

					const { symbolTitle, strikePrice } = 'symbolInfo' in option ? option.symbolInfo : option;

					return (
						<div className='w-full flex-1 flex-justify-between'>
							<span>{symbolTitle}</span>
							<span>{sepNumbers(String(strikePrice))}</span>
						</div>
					);
				}}
				onChange={onSelect}
				onChangeTerm={setTerm}
				classes={{
					root: '!h-48',
				}}
			/>

			{isLoadingOption && <div className='size-24 spinner' />}
		</div>
	);
};

export default ContractSearch;
