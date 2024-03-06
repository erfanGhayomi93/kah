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

	const [symbol, setSymbol] = useState<Option.Root | Option.Search | null>(null);

	const { data: optionData, isLoading: isLoadingOptionData } = useOptionSymbolSearchQuery({
		queryKey: ['optionSymbolSearchQuery', term],
		enabled: basis === 'contract',
	});

	const onSelect = async (symbol: Option.Root | Option.Search) => {
		setSymbol(symbol);

		const params: NonNullable<IBlackScholesModalStates['contract']> = {
			baseSymbolPrice: 0,
			contractEndDate: 0,
			premium: 0,
			historicalVolatility: 0,
			strikePrice: 0,
		};

		if ('symbolInfo' in symbol) {
			params.baseSymbolPrice = symbol.optionWatchlistData.baseSymbolPrice;
			params.contractEndDate = new Date(symbol.symbolInfo.contractEndDate).getTime();
			params.premium = symbol.optionWatchlistData.premium;
			params.historicalVolatility = symbol.optionWatchlistData.historicalVolatility;
			params.strikePrice = symbol.symbolInfo.strikePrice;
		} else {
			try {
				const response = await axios.get<ServerResponse<Option.Root>>(routes.optionWatchlist.Watchlist, {
					params: { SymbolISINs: symbol.symbolISIN },
				});
				const { data } = response;

				if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

				// const { result } = data;

				params.baseSymbolPrice = 0;
				params.contractEndDate = Date.now();
				params.premium = 0;
				params.historicalVolatility = 0;
				params.strikePrice = 0;
			} catch (e) {
				//
			}
		}

		onChange(params);
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
				value={symbol}
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
		</div>
	);
};

export default ContractSearch;
