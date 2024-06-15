import axios from '@/api/axios';
import { useCustomWatchlistSymbolSearch } from '@/api/queries/optionQueries';
import routes from '@/api/routes';
import { EyeSVG, EyeSlashSVG, SearchSVG, XSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setAddSymbolToWatchlistModal } from '@/features/slices/modalSlice';
import { getOptionWatchlistTabId } from '@/features/slices/tabSlice';
import { cn } from '@/utils/helpers';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { forwardRef, useCallback, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';

const Div = styled.div`
	width: 496px;
	height: 600px;
	display: flex;
	flex-direction: column;
`;

interface AddSymbolToWatchlistProps extends IBaseModalConfiguration {}

const AddSymbolToWatchlist = forwardRef<HTMLDivElement, AddSymbolToWatchlistProps>((props, ref) => {
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
		dispatch(setAddSymbolToWatchlistModal(null));
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

			toast.success(t('alerts.symbol_added_successfully'), {
				toastId: 'symbol_added_successfully',
			});

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
		<Modal
			style={{ modal: { transform: 'translate(-50%, -50%)' } }}
			top='50%'
			onClose={onCloseModal}
			{...props}
			ref={ref}
		>
			<Div className='bg-white'>
				<Header label={t('add_symbol_to_watchlist.title')} onClose={onCloseModal} />

				<div className='flex-1 gap-24 overflow-hidden rounded p-24 flex-column'>
					<div className='relative h-40 rounded flex-items-center input-group'>
						<span className='text-light-gray-700 px-8'>
							<SearchSVG />
						</span>
						<input
							ref={inputRef}
							type='text'
							inputMode='numeric'
							maxLength={32}
							className='text-light-gray-800 h-40 flex-1 pl-8'
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
								className='bg-light-gray-800 ml-16 min-h-20 min-w-20 rounded-circle text-white transition-opacity flex-justify-center'
							>
								<XSVG width='1rem' height='1rem' />
							</button>
						)}
					</div>

					<div className='border-light-gray-200 relative flex-1 overflow-hidden rounded border'>
						{term.length < 2 ? (
							<div className='absolute center'>
								<span className='text-light-gray-700 font-medium'>
									{t('common.needs_more_than_n_chars', { n: 2 })}
								</span>
							</div>
						) : isFetching ? (
							<div className='absolute size-48 center spinner' />
						) : !Array.isArray(symbolsData) || symbolsData.length === 0 ? (
							<div className='absolute center'>
								<span className='text-light-gray-700 font-medium'>{t('common.symbol_not_found')}</span>
							</div>
						) : (
							<ul className='h-full gap-4 overflow-auto flex-column'>
								{symbolsData?.map((item) => (
									<li key={item.symbolISIN}>
										<button
											onClick={() => onAddSymbol(item)}
											type='button'
											className='h-48 w-full px-16 transition-colors flex-justify-between hover:btn-hover'
										>
											<span className='text-light-gray-800 text-base font-medium'>
												{item.symbolTitle}
											</span>
											<span className='text-light-gray-700 text-base font-medium'>
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
});

export default AddSymbolToWatchlist;
