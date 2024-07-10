import { useOptionBaseSymbolSearchQuery } from '@/api/queries/optionQueries';
import Popup from '@/components/common/Popup';
import { SearchSVG, XCircleSVG } from '@/components/icons';
import { useDebounce } from '@/hooks';
import { cn } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
import Dropdown from './Dropdown';

interface BaseSymbolAdvanceSearchProps {
	values: Option.BaseSearch[];
	onChange: (values: IOptionWatchlistFilters['symbols']) => void;
}

interface SelectedSymbolProps {
	title: string;
	onRemoveSymbol: () => void;
}

const BaseSymbolAdvanceSearch = ({ values, onChange }: BaseSymbolAdvanceSearchProps) => {
	const t = useTranslations();

	const inputRef = useRef<HTMLInputElement>(null);

	const [isDebouncing, setIsDebouncing] = useState(false);

	const [term, setTerm] = useState('');

	const [onlyShowTags, setOnlyShowTags] = useState(false);

	const [enabled, setEnabled] = useState(false);

	const { data: symbolsData, isFetching } = useOptionBaseSymbolSearchQuery({
		queryKey: ['optionBaseSymbolSearchQuery', { term, orderBy: 'Alphabet' }],
		enabled,
	});

	const { setDebounce } = useDebounce();

	const seeTags = (cb: () => void) => {
		setOnlyShowTags(true);
		cb();
	};

	const onChangeInput = (value: string) => {
		setIsDebouncing(true);
		setTerm(value);

		setDebounce(() => setIsDebouncing(false), 500);
	};

	const onClearTerm = () => {
		setTerm('');
		if (inputRef.current) inputRef.current.focus();
	};

	const onToggleSymbol = (symbol: Option.BaseSearch) => {
		try {
			const isExists = isSymbolSelected(symbol.symbolISIN);

			if (isExists) onChange(values.filter((item) => item.symbolISIN !== symbol.symbolISIN));
			else onChange([...values, symbol]);
		} catch (e) {
			//
		}
	};

	const onRemoveSymbol = (symbolISIN: string) => {
		onChange(values.filter((item) => item.symbolISIN !== symbolISIN));
	};

	const isSymbolSelected = useCallback(
		(symbolISIN: string) => {
			return values.findIndex((item) => item.symbolISIN === symbolISIN) > -1;
		},
		[values],
	);

	const isLoading = isFetching || isDebouncing;

	useEffect(() => {
		if (values.length === 0 && onlyShowTags) setOnlyShowTags(false);
	}, [values]);

	return (
		<Popup
			zIndex={9999}
			onClose={() => {
				setOnlyShowTags(false);
			}}
			margin={{ y: 8 }}
			onOpen={() => setEnabled(true)}
			renderer={({ setOpen }) => (
				<Dropdown
					tagOnly={onlyShowTags}
					data={symbolsData ?? []}
					selectedSymbols={values ?? []}
					isFetching={isFetching || isDebouncing}
					close={() => setOpen(false)}
					removeAllSymbols={() => onChange([])}
					addSymbol={(sym) => onToggleSymbol(sym)}
					removeSymbol={onRemoveSymbol}
					isSymbolSelected={isSymbolSelected}
				/>
			)}
		>
			{({ setOpen, open }) => (
				<div
					className={cn(
						'h-40 flex-1 rounded border transition-colors flex-items-center',
						open ? 'border-light-info-100' : 'border-light-gray-200',
					)}
				>
					<span className='px-8 text-light-gray-700'>
						<SearchSVG />
					</span>
					<input
						ref={inputRef}
						type='text'
						inputMode='numeric'
						maxLength={32}
						className='h-40 flex-1 rounded bg-transparent pl-8 text-light-gray-800'
						placeholder={t('option_watchlist_filters_modal.base_symbol_placeholder')}
						value={term}
						onFocus={() => {
							setOnlyShowTags(false);
							setOpen(true);
						}}
						onChange={(e) => onChangeInput(e.target.value)}
					/>

					{isLoading ? (
						<div className='ml-16 min-h-20 min-w-20 spinner' />
					) : (
						term.length > 1 && (
							<button onClick={onClearTerm} type='button' className='ml-8 text-light-gray-700'>
								<XCircleSVG width='1.6rem' height='1.6rem' />
							</button>
						)
					)}

					{values.length > 0 && (
						<button
							onMouseOver={() => {
								if (!open) seeTags(() => setOpen(true));
							}}
							type='button'
							className='h-24 w-40 border-r border-r-light-gray-200 text-tiny text-light-gray-100 flex-justify-center'
						>
							<span className='size-24 rounded-circle bg-light-primary-100 pt-2 text-white flex-justify-center'>
								{values.length}
							</span>
						</button>
					)}
				</div>
			)}
		</Popup>
	);
};

export default BaseSymbolAdvanceSearch;
