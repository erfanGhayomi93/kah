import { useOptionSymbolSearchQuery } from '@/api/queries/optionQueries';
import Loading from '@/components/common/Loading';
import Select, { type TSelectOptions } from '@/components/common/Select';
import { SearchSVG } from '@/components/icons';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

type SortDirection = 'sort_highest_value_per_day' | 'sort_closest_due_date' | 'sort_alphabet';

interface SelectSymbolProps {
	selectedSymbol: null | Option.SymbolSearch;
	setSelectedSymbol: React.Dispatch<React.SetStateAction<Option.SymbolSearch | null>>;
}

const SelectSymbol = ({ selectedSymbol, setSelectedSymbol }: SelectSymbolProps) => {
	const t = useTranslations();

	const [symbolTerm, setSymbolTerm] = useState('');

	const { data: symbolsData, isFetching } = useOptionSymbolSearchQuery({
		queryKey: ['optionSymbolSearchQuery', symbolTerm],
	});

	const sortingOptions = useMemo<TSelectOptions[]>(
		() => [
			{
				id: 'sort_highest_value_per_day',
				title: t('option_chain.sort_highest_value_per_day'),
			},
			{
				id: 'sort_closest_due_date',
				title: t('option_chain.sort_closest_due_date'),
			},
			{
				id: 'sort_alphabet',
				title: t('option_chain.sort_alphabet'),
			},
		],
		[],
	);

	const [sorting, setSorting] = useState<TSelectOptions>(sortingOptions[0]);

	const onChangeSorting = (option: TSelectOptions) => {
		setSorting(option);
	};

	const symbols = useMemo(() => {
		if (isFetching) return <Loading />;

		if (!Array.isArray(symbolsData) || symbolsData.length === 0)
			return (
				<span className='center absolute text-base font-medium text-gray-200'>
					{t('option_chain.no_symbol_found')}
				</span>
			);

		return (
			<ul className='flex flex-wrap gap-16'>
				{symbolsData.map((symbol) => (
					<li key={symbol.symbolISIN}>
						<button
							className={clsx(
								'h-32 rounded border px-12 text-base transition-colors flex-justify-center',
								symbol.symbolISIN === selectedSymbol?.symbolISIN
									? 'border-primary-200 bg-primary-200 text-white'
									: 'border-gray-400 text-gray-100 hover:border-primary-200 hover:bg-primary-200 hover:text-white',
							)}
							onClick={() => setSelectedSymbol(symbol)}
							type='button'
						>
							{symbol.symbolTitle}
						</button>
					</li>
				))}
			</ul>
		);
	}, [symbolsData, isFetching, selectedSymbol]);

	return (
		<div style={{ flex: 1.4 }} className='gap-24 rounded bg-white p-16 flex-column'>
			<div className='flex-justify-between'>
				<label
					style={{ maxWidth: '40rem' }}
					className='input-group h-40 flex-1 rounded border border-gray-400 flex-items-center'
				>
					<div className='px-8'>
						<SearchSVG width='2rem' height='2rem' />
					</div>

					<input
						type='text'
						inputMode='search'
						className='h-full flex-1 border-none bg-transparent'
						maxLength={24}
						placeholder={t('option_chain.symbol_search_placeholder')}
						value={symbolTerm}
						onChange={(e) => setSymbolTerm(e.target.value)}
					/>
				</label>

				<div style={{ maxWidth: '17.6rem' }} className='flex w-full flex-1 justify-end'>
					<Select value={sorting} options={sortingOptions} onChange={onChangeSorting} />
				</div>
			</div>

			<div className='relative h-full'>{symbols}</div>
		</div>
	);
};

export default SelectSymbol;
