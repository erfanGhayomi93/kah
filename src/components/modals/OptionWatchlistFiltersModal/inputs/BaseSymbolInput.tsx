import { useOptionSymbolSearchQuery } from '@/api/queries/optionQueries';
import Portal from '@/components/common/Portal';
import { CheckSVG, SearchSVG, XSVG } from '@/components/icons';
import { useDebounce } from '@/hooks';
import { findStringIn } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import styles from '../index.module.scss';

interface BaseSymbolInputProps {
	values: Option.Search[];
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
			<XSVG width='0.8rem' height='0.8rem' />
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

	const { data: symbolsData, isFetching } = useOptionSymbolSearchQuery({
		queryKey: ['optionSymbolSearchQuery', { term, orderBy: 'Alphabet' }],
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

	const onToggleSymbol = (symbol: Option.Search) => {
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
		<Portal
			zIndex={9999}
			onClose={() => {
				setOnlyShowTags(false);
			}}
			onOpen={() => setEnabled(true)}
			renderer={({ setOpen }) => (
				<div
					style={{ height: onlyShowTags ? undefined : '59vh' }}
					className={clsx(
						'justify-between rounded-b border-x border-b border-primary-300 bg-white flex-column',
						values.length === 0 &&
							!(isLoading || symbolsDataIsEmpty) &&
							!(onlyShowTags && values.length === 0) &&
							'pt-16',
					)}
				>
					{values.length > 0 && (
						<div
							className={clsx(
								'w-full flex-wrap px-16 flex-justify-between',
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
							<span className='text-gray-900 text-base'>
								{t('option_watchlist_filters_modal.symbol_not_found')}
							</span>
						</div>
					)}

					{!onlyShowTags && (
						<Fragment>
							<div
								style={{ minHeight: '9.6rem', maxHeight: 'calc(76vh - 28rem)' }}
								className={clsx(
									'flex-1 gap-4 overflow-auto py-8 flex-column',
									(isLoading || symbolsDataIsEmpty) && 'items-center justify-center',
								)}
							>
								{isLoading ? (
									<span className='text-gray-900 text-base'>{t('common.searching')}</span>
								) : symbolsDataIsEmpty ? (
									<span className='text-gray-900 text-base'>
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
												className={clsx(
													'min-h-40 text-right transition-colors flex-justify-start',
													isSelected
														? 'bg-primary-300 text-white'
														: 'bg-transparent hover:bg-secondary-100',
												)}
											>
												<div className='w-32 flex-justify-center'>
													{isSelected && (
														<div className='h-16 w-16 rounded-sm bg-white text-primary-400 flex-justify-center'>
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
								<div className='px-16 py-16'>
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
					className={clsx(
						'input-group h-40 flex-1 border flex-items-center',
						open ? 'rounded-t border-primary-300' : 'rounded border-gray-500',
					)}
				>
					<span className='text-gray-1000 px-8'>
						<SearchSVG />
					</span>
					<input
						ref={inputRef}
						type='text'
						inputMode='numeric'
						maxLength={32}
						className='text-gray-1000 h-40 flex-1 rounded bg-transparent pl-8'
						placeholder={t('option_watchlist_filters_modal.base_symbol_placeholder')}
						value={term}
						onFocus={() => setOpen(true)}
						onChange={(e) => onChangeInput(e.target.value)}
					/>
					{isLoading ? (
						<div className='spinner ml-16 min-h-20 min-w-20' />
					) : (
						term.length > 1 && (
							<button
								onClick={onClearTerm}
								type='button'
								className='bg-gray-1000 ml-16 min-h-20 min-w-20 rounded-circle text-white flex-justify-center'
							>
								<XSVG width='0.8rem' height='0.8rem' />
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
		</Portal>
	);
};

export default BaseSymbolInput;
