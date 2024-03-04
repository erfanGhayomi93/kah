import { useOptionBaseSymbolSearchQuery } from '@/api/queries/optionQueries';
import Select from '@/components/common/Inputs/Select';
import Loading from '@/components/common/Loading';
import { cn } from '@/utils/helpers';
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
							className={cn(
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
					className='relative h-40 flex-1 rounded border border-input flex-items-center input-group'
				>
					<div className='px-8'>
						<svg
							width='2rem'
							height='2rem'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								className='text-primary-400'
								d='M21.3023 22C21.2106 22.0002 21.1199 21.9822 21.0352 21.9471C20.9506 21.9119 20.8738 21.8604 20.8093 21.7953L17.0139 18C16.8907 17.8677 16.8236 17.6928 16.8268 17.512C16.83 17.3313 16.9032 17.1588 17.031 17.031C17.1588 16.9032 17.3313 16.83 17.512 16.8268C17.6928 16.8236 17.8677 16.8907 18 17.0139L21.7953 20.8093C21.8927 20.9068 21.9591 21.0311 21.986 21.1663C22.0128 21.3016 21.999 21.4418 21.9463 21.5692C21.8935 21.6966 21.8042 21.8055 21.6896 21.8822C21.5749 21.9588 21.4402 21.9998 21.3023 22Z'
								fill='currentColor'
							/>
							<path
								className='text-gray-900'
								d='M10.6047 19.2093C8.90281 19.2093 7.23919 18.7046 5.82417 17.7592C4.40914 16.8137 3.30626 15.4698 2.65499 13.8975C2.00373 12.3252 1.83333 10.5951 2.16534 8.92597C2.49735 7.25683 3.31687 5.72363 4.52025 4.52025C5.72363 3.31687 7.25683 2.49735 8.92597 2.16534C10.5951 1.83333 12.3252 2.00373 13.8975 2.65499C15.4698 3.30626 16.8137 4.40914 17.7592 5.82417C18.7046 7.23919 19.2093 8.90281 19.2093 10.6047C19.2068 12.886 18.2995 15.0732 16.6863 16.6863C15.0732 18.2995 12.886 19.2068 10.6047 19.2093ZM10.6047 3.39535C9.17879 3.39535 7.78494 3.81817 6.59938 4.61034C5.41382 5.40251 4.48978 6.52845 3.94413 7.84577C3.39847 9.1631 3.2557 10.6126 3.53388 12.0111C3.81205 13.4096 4.49867 14.6942 5.50691 15.7024C6.51515 16.7106 7.79972 17.3973 9.19819 17.6754C10.5967 17.9536 12.0462 17.8108 13.3635 17.2652C14.6809 16.7195 15.8068 15.7955 16.599 14.6099C17.3911 13.4244 17.814 12.0305 17.814 10.6047C17.8117 8.69331 17.0515 6.86088 15.6999 5.50935C14.3484 4.15783 12.516 3.39757 10.6047 3.39535Z'
								fill='currentColor'
							/>
						</svg>
					</div>

					<input
						type='text'
						inputMode='search'
						className='h-full flex-1 border-none bg-transparent'
						maxLength={24}
						value={symbolTerm}
						onChange={(e) => setSymbolTerm(e.target.value)}
					/>

					<span style={{ right: '3.6rem' }} className={cn('flexible-placeholder', symbolTerm && 'active')}>
						{t('option_chain.symbol_search_placeholder')}
					</span>
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
