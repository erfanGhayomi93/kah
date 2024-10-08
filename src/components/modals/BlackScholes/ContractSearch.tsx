import axios from '@/api/axios';
import { useOptionSymbolSearchQuery } from '@/api/queries/optionQueries';
import routes from '@/api/routes';
import AsyncSelect from '@/components/common/Inputs/AsyncSelect';
import { sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

interface SymbolSearchProps {
	basis: 'base' | 'contract';
	isLoading: boolean;
	disabled: boolean;
	options: Option.Root[];
	value: IBlackScholesModalStates['contract'];
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

		let result: Option.Root | null = null;

		if ('symbolInfo' in symbol) {
			result = symbol;
		} else {
			try {
				const response = await axios.get<ServerResponse<Option.Root>>(
					routes.optionWatchlist.WatchlistInfoBySymbolISIN,
					{
						params: { symbolISIN: symbol.symbolISIN },
					},
				);
				const { data } = response;

				if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

				result = data.result;
			} catch (e) {
				//
			}
		}

		try {
			if (!result) return;
			onChange({
				baseSymbolPrice: result.optionWatchlistData.baseSymbolPrice,
				contractEndDate: new Date(result.symbolInfo.contractEndDate).getTime(),
				premium: result.optionWatchlistData.premium,
				historicalVolatility: result.optionWatchlistData.historicalVolatility,
				strikePrice: result.symbolInfo.strikePrice,
			});
		} catch (e) {
			//
		}
	};

	const data = useMemo(() => {
		if (basis === 'contract') return optionData ?? [];

		const strikePrices = new Set<number>();

		const uniqueOptions = options.filter(({ symbolInfo }) => {
			const exists = strikePrices.has(symbolInfo.strikePrice);
			if (exists) return false;

			strikePrices.add(symbolInfo.strikePrice);
			return true;
		});

		if (!term) return uniqueOptions;
		return uniqueOptions.filter((o) => String(o.symbolInfo.strikePrice).includes(term));
	}, [term, basis, optionData, options]);

	useEffect(() => {
		if (value === null) setSymbol(null);
	}, [value]);

	return (
		<div className='relative flex-1'>
			<AsyncSelect<Option.Root | Option.Search>
				options={data}
				value={symbol}
				term={term}
				disabled={basis === 'base' && disabled}
				loading={basis === 'base' ? isLoading : isLoadingOptionData}
				blankPlaceholder={t('black_scholes_modal.no_contract_found')}
				placeholder={t(
					basis === 'base'
						? 'black_scholes_modal.strike_price'
						: 'black_scholes_modal.symbol_search_placeholder',
				)}
				getOptionId={(option) => ('symbolInfo' in option ? option.symbolInfo!.symbolISIN : option.symbolISIN)}
				getOptionTitle={(option) => {
					if (!option) return null;

					const { symbolTitle, strikePrice } = 'symbolInfo' in option ? option.symbolInfo : option;

					if (basis === 'contract')
						return (
							<div className='w-full flex-1 flex-justify-between'>
								<span>{symbolTitle}</span>
								<span>{sepNumbers(String(strikePrice))}</span>
							</div>
						);

					return <div className='w-full flex-1 flex-justify-end'>{sepNumbers(String(strikePrice))}</div>;
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
