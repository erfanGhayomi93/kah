import { useOptionSymbolSearchQuery } from '@/api/queries/optionQueries';
import Loading from '@/components/common/Loading';
import { SearchSVG } from '@/components/icons';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

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
				<label className='input-group h-40 flex-1 rounded border border-gray-400 flex-items-center'>
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

				<div className='flex flex-1 justify-end' />
			</div>

			<div className='relative h-full'>{symbols}</div>
		</div>
	);
};

export default SelectSymbol;
