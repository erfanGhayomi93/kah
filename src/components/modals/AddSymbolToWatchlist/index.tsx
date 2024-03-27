import axios from '@/api/axios';
import { useCustomWatchlistSymbolSearch } from '@/api/queries/optionQueries';
import routes from '@/api/routes';
import { EyeSVG, EyeSlashSVG, SearchSVG, XSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { toggleAddSymbolToWatchlistModal } from '@/features/slices/modalSlice';
import { getOptionWatchlistTabId } from '@/features/slices/tabSlice';
import { cn } from '@/utils/helpers';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import Modal from '../Modal';

const Div = styled.div`
	width: 496px;
	height: 600px;
	display: flex;
	flex-direction: column;
`;

interface AddSymbolToWatchlistProps extends IBaseModalConfiguration {}

const AddSymbolToWatchlist = (props: AddSymbolToWatchlistProps) => {
	const inputRef = useRef<HTMLInputElement>(null);

	const watchlistId = useAppSelector(getOptionWatchlistTabId);

	const queryClient = useQueryClient();

	const dispatch = useAppDispatch();

	const t = useTranslations();

	const [term, setTerm] = useState('');

	const [symbols, setSymbols] = useState<string[]>([]);

	const { data: symbolsData, isFetching } = useCustomWatchlistSymbolSearch({
		queryKey: ['customWatchlistSymbolSearch', { term, id: watchlistId }],
	});

	const onCloseModal = () => {
		dispatch(toggleAddSymbolToWatchlistModal(null));
	};

	const onAddSymbol = async (symbol: Symbol.Search) => {
		try {
			if (!symbol.symbolISIN || watchlistId === -1) return;

			setSymbols((prev) => [...prev, symbol.symbolISIN]);
			const response = await axios.post<ServerResponse<string>>(routes.optionWatchlist.AddSymbolCustomWatchlist, {
				id: watchlistId,
				symbolISINs: [symbol.symbolISIN],
			});
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			queryClient.refetchQueries({
				queryKey: ['optionWatchlistQuery', { watchlistId }],
			});
		} catch (e) {
			//
		}
	};

	const hasChanged = useCallback((symbolISIN: string) => symbols.includes(symbolISIN), [symbols]);

	const placeholder = t('option_watchlist_filters_modal.base_symbol_placeholder');

	return (
		<Modal style={{ modal: { transform: 'translate(-50%, -50%)' } }} top='50%' onClose={onCloseModal} {...props}>
			<Div className='bg-white'>
				<Modal.Header label={t('add_symbol_to_watchlist.title')} onClose={onCloseModal} />

				<div className='flex-1 gap-24 overflow-hidden rounded p-24 flex-column'>
					<div className='relative h-40 rounded flex-items-center input-group'>
						<span className='px-8 text-gray-900'>
							<SearchSVG />
						</span>
						<input
							ref={inputRef}
							type='text'
							inputMode='numeric'
							maxLength={32}
							className='h-40 flex-1 pl-8 text-gray-1000'
							value={term}
							onChange={(e) => setTerm(e.target.value)}
						/>

						<span style={{ right: '3.6rem' }} className={cn('flexible-placeholder', term && 'active')}>
							{placeholder}
						</span>

						<fieldset className={cn('flexible-fieldset', term && 'active')}>
							<legend>{placeholder}</legend>
						</fieldset>

						{isFetching ? (
							<div className='ml-16 min-h-20 min-w-20 spinner' />
						) : (
							<button
								onClick={() => setTerm('')}
								type='button'
								style={{
									opacity: term.length > 1 ? 1 : 0,
									pointerEvents: term.length > 1 ? 'auto' : 'none',
								}}
								className='ml-16 min-h-20 min-w-20 rounded-circle bg-gray-1000 text-white transition-opacity flex-justify-center'
							>
								<XSVG width='1rem' height='1rem' />
							</button>
						)}
					</div>

					<div className='relative flex-1 overflow-hidden rounded border border-gray-500'>
						{term.length < 2 ? (
							<div className='absolute center'>
								<span className='font-medium text-gray-900'>
									{t('common.needs_more_than_n_chars', { n: 2 })}
								</span>
							</div>
						) : isFetching ? (
							<div className='absolute size-48 center spinner' />
						) : !Array.isArray(symbolsData) || symbolsData.length === 0 ? (
							<div className='absolute center'>
								<span className='font-medium text-gray-900'>{t('common.symbol_not_found')}</span>
							</div>
						) : (
							<ul className='h-full gap-4 overflow-auto flex-column'>
								{symbolsData?.map((item) => (
									<li key={item.symbolISIN}>
										<button
											onClick={() => onAddSymbol(item)}
											type='button'
											className='hover:btn-hover h-48 w-full px-16 transition-colors flex-justify-between'
										>
											<span className='text-base font-medium text-gray-1000'>
												{item.symbolTitle}
											</span>
											<span className='text-base font-medium text-gray-900'>
												{item.isInWatchlist ? (
													hasChanged(item.symbolISIN) ? (
														<EyeSVG width='2.4rem' height='2.4rem' />
													) : (
														<EyeSlashSVG width='2.4rem' height='2.4rem' />
													)
												) : hasChanged(item.symbolISIN) ? (
													<EyeSlashSVG width='2.4rem' height='2.4rem' />
												) : (
													<EyeSVG width='2.4rem' height='2.4rem' />
												)}
											</span>
										</button>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			</Div>
		</Modal>
	);
};

export default AddSymbolToWatchlist;
