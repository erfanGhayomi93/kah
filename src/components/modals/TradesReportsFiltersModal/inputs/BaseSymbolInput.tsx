import { useOptionBaseSymbolSearchQuery } from '@/api/queries/optionQueries';
import Popup from '@/components/common/Popup';
import { CheckSVG, SearchSVG, XSVG } from '@/components/icons';
import { useDebounce } from '@/hooks';
import { cn, findStringIn } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import styles from '../index.module.scss';

interface BaseSymbolInputProps {
	values: Option.BaseSearch[];
	onChange: (values: IOptionWatchlistFilters['symbols']) => void;
}

interface SelectedSymbolProps {
	title: string;
	onRemoveSymbol: () => void;
}

const SelectedSymbol = ({ title, onRemoveSymbol }: SelectedSymbolProps) => (
	<li>
		<span className='truncate'>{title}</span>
		<button onClick={onRemoveSymbol} type='button'>
			<XSVG width='1rem' height='1rem' />
		</button>
	</li>
);

const BaseSymbolInput = ({ values, onChange }: BaseSymbolInputProps) => {
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

	const onRemoveSymbol = (deleteSymbolISIN: string) => {
		onChange(values.filter((item) => item.symbolISIN !== deleteSymbolISIN));
	};

	const isSymbolSelected = useCallback(
		(symbolISIN: string) => {
			return values.some((item) => item.symbolISIN === symbolISIN);
		},
		[values],
	);

	const isLoading = isFetching || isDebouncing;

	const symbolsDataIsEmpty = !Array.isArray(symbolsData) || symbolsData.length === 0;

	useEffect(() => {
		if (values.length === 0 && onlyShowTags) setOnlyShowTags(false);
	}, [values]);

	return (
		<Popup
			zIndex={9999}
			onClose={() => {
				setOnlyShowTags(false);
			}}
			onOpen={() => setEnabled(true)}
			renderer={({ setOpen }) => (
				<div
					style={{
						height: onlyShowTags ? '100%' : `calc(${(636 / window.innerHeight) * 100}vh - 16.5rem)`,
					}}
					className={cn(
						'justify-between rounded-b border-x border-b border-primary-300 bg-white flex-column',
					)}
				>
					{values.length > 0 && (
						<div
							className={cn(
								'w-full flex-wrap px-16 pb-12 flex-justify-between',
								!onlyShowTags && 'border-b border-b-gray-500',
							)}
						>
							<ul className={styles.tags}>
								{values.map((item, index) => (
									<SelectedSymbol
										key={index}
										title={item.symbolTitle}
										onRemoveSymbol={() => onRemoveSymbol(item.symbolISIN)}
									/>
								))}
							</ul>
							<button className='text-base text-error-100' onClick={() => onChange([])} type='button'>
								{t('option_watchlist_filters_modal.delete_selected_symbols')}
							</button>
						</div>
					)}

					{onlyShowTags && values.length === 0 && (
						<div style={{ minHeight: '9.6rem' }} className='flex-justify-center'>
							<span className='text-base text-gray-900'>
								{t('option_watchlist_filters_modal.symbol_not_found')}
							</span>
						</div>
					)}

					{!onlyShowTags && (
						<Fragment>
							<div
								style={{ minHeight: '9.6rem' }}
								className={cn(
									'flex-1 gap-4 overflow-auto py-8 flex-column',
									(isLoading || symbolsDataIsEmpty) && 'items-center justify-center',
								)}
							>
								{isLoading ? (
									<span className='text-base text-gray-900'>{t('common.searching')}</span>
								) : symbolsDataIsEmpty ? (
									<span className='text-base text-gray-900'>
										{t('option_watchlist_filters_modal.symbol_not_found')}
									</span>
								) : (
									symbolsData!.map((item) => {
										const { symbolTitle, symbolISIN } = item;
										const isSelected = isSymbolSelected(symbolISIN);
										const title = findStringIn(term, symbolTitle);

										return (
											<button
												onClick={() => onToggleSymbol(item)}
												type='button'
												key={symbolISIN}
												className={cn(
													'min-h-40 text-right transition-colors flex-justify-start',
													isSelected
														? 'bg-primary-400 text-white hover:bg-primary-300'
														: 'bg-transparent hover:btn-hover',
												)}
											>
												<div className='w-32 flex-justify-center'>
													{isSelected && (
														<div className='size-16 rounded-sm bg-white text-primary-400 flex-justify-center'>
															<CheckSVG />
														</div>
													)}
												</div>

												<div className='inline-block'>
													<span
														className={
															isSelected
																? 'text-white'
																: term
																	? 'text-gray-800'
																	: 'text-gray-1000'
														}
													>
														{title[0]}
													</span>
													<span className={isSelected ? 'text-white' : 'text-gray-1000'}>
														{title[1]}
													</span>
													<span
														className={
															isSelected
																? 'text-white'
																: term
																	? 'text-gray-800'
																	: 'text-gray-1000'
														}
													>
														{title[2]}
													</span>
												</div>
											</button>
										);
									})
								)}
							</div>

							{!symbolsDataIsEmpty && (
								<div className='border-t border-t-gray-500 p-16'>
									<button
										style={{ width: '14rem' }}
										className='mr-auto h-40 rounded btn-primary'
										type='button'
										onClick={() => setOpen(false)}
									>
										{t('common.close')}
									</button>
								</div>
							)}
						</Fragment>
					)}
				</div>
			)}
		>
			{({ setOpen, open }) => (
				<div
					className={cn(
						'h-40 flex-1 border flex-items-center input-group',
						open ? 'rounded-t border-primary-300' : 'rounded border-gray-500',
					)}
				>
					<span className='px-8 text-gray-900'>
						<SearchSVG />
					</span>
					<input
						ref={inputRef}
						type='text'
						inputMode='numeric'
						maxLength={32}
						className='h-40 flex-1 rounded bg-transparent pl-8 text-gray-1000'
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
							<button
								onClick={onClearTerm}
								type='button'
								className='ml-16 min-h-20 min-w-20 rounded-circle bg-gray-1000 text-white flex-justify-center'
							>
								<XSVG width='1rem' height='1rem' />
							</button>
						)
					)}
					{values.length > 0 && (
						<button
							onClick={() => seeTags(() => setOpen(true))}
							type='button'
							className='h-24 w-40 border-r border-r-gray-500 text-tiny text-gray-200 flex-justify-center'
						>
							<span
								style={{ paddingTop: '2px' }}
								className='size-24 rounded-circle bg-primary-400 text-white flex-justify-center'
							>
								{values.length}
							</span>
						</button>
					)}
				</div>
			)}
		</Popup>
	);
};

export default BaseSymbolInput;
