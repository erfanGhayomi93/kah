import { useOptionBaseSymbolSearchQuery } from '@/api/queries/optionQueries';
import Select from '@/components/common/Inputs/Select';
import Loading from '@/components/common/Loading';
import { SearchSVG } from '@/components/icons';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import styled from 'styled-components';

const Symbol = styled.button`
	width: 11.2rem;
	height: 3.2rem;
	border-radius: 0.8rem;
	font-size: 1.4rem;
	padding: 0 1.2rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	display: flex;
	justify-content: center;
	align-items: center;

	@media (max-width: 1280px) {
		width: 10.4rem;
	}

	@media (max-width: 992px) {
		width: 8rem;
	}
`;

interface TSelectOptions {
	id: string | number;
	title: string | React.ReactNode;
}

interface SelectSymbolProps {
	selectedSymbol: null | string;
	setSelectedSymbol: React.Dispatch<React.SetStateAction<string | null>>;
}

const SelectSymbol = ({ selectedSymbol, setSelectedSymbol }: SelectSymbolProps) => {
	const t = useTranslations();

	const sortingOptions = useMemo<TSelectOptions[]>(
		() => [
			{
				id: 'MaximumValue',
				title: t('option_chain.sort_highest_value_per_day'),
			},
			{
				id: 'ClosestSettlement',
				title: t('option_chain.sort_closest_due_date'),
			},
			{
				id: 'Alphabet',
				title: t('option_chain.sort_alphabet'),
			},
		],
		[],
	);

	const [symbolTerm, setSymbolTerm] = useState('');

	const [sorting, setSorting] = useState<TSelectOptions>(sortingOptions[0]);

	const { data: symbolsData, isFetching } = useOptionBaseSymbolSearchQuery({
		queryKey: [
			'optionBaseSymbolSearchQuery',
			{ term: symbolTerm, orderBy: String(sorting.id) as 'MaximumValue' | 'ClosestSettlement' | 'Alphabet' },
		],
	});

	const onChangeSorting = (option: TSelectOptions) => {
		setSorting(option);
	};

	const symbols = useMemo(() => {
		if (isFetching) return <Loading />;

		if (!Array.isArray(symbolsData) || symbolsData.length === 0)
			return (
				<span className='absolute text-base font-medium text-gray-900 center'>
					{t('common.no_symbol_found')}
				</span>
			);

		return (
			<ul className='flex-wrap gap-16 flex-justify-between'>
				{symbolsData.map((symbol) => (
					<li key={symbol.symbolISIN}>
						<Symbol
							className={clsx(
								'border transition-colors',
								symbol.symbolISIN === selectedSymbol
									? 'border-primary-400 bg-primary-400 text-white hover:bg-primary-300'
									: 'border-gray-500 text-gray-1000 shadow-sm hover:bg-primary-100 hover:shadow-none',
							)}
							onClick={() => setSelectedSymbol(symbol.symbolISIN)}
							type='button'
						>
							{symbol.symbolTitle}
						</Symbol>
					</li>
				))}

				<li className='flex-1'></li>
			</ul>
		);
	}, [symbolsData, isFetching, selectedSymbol]);

	return (
		<div className='flex-1 gap-24 rounded bg-white p-16 flex-column'>
			<div className='gap-24 flex-justify-between'>
				<label
					style={{ maxWidth: '30rem' }}
					className='input-group h-40 flex-1 rounded border border-gray-500 flex-items-center'
				>
					<div className='px-8 text-gray-900'>
						<SearchSVG width='2rem' height='2rem' />
					</div>

					<input
						autoFocus
						type='text'
						inputMode='search'
						className='h-full flex-1 border-none bg-transparent'
						maxLength={24}
						placeholder={t('option_chain.symbol_search_placeholder')}
						value={symbolTerm}
						onChange={(e) => setSymbolTerm(e.target.value)}
					/>
				</label>

				<div className='gap-8 flex-items-center'>
					<span className='text-base text-gray-900'>{t('option_chain.sort_based_on')}:</span>
					<div style={{ width: '17.6rem' }} className='flex flex-1 justify-end'>
						<Select<TSelectOptions>
							value={sorting}
							options={sortingOptions}
							onChange={onChangeSorting}
							getOptionId={(option) => option.id}
							getOptionTitle={(option) => option.title}
						/>
					</div>
				</div>
			</div>

			<div className='relative h-full'>{symbols}</div>
		</div>
	);
};

export default SelectSymbol;
