import axios from '@/api/axios';
import { useOptionSymbolSearchQuery } from '@/api/queries/optionQueries';
import routes from '@/api/routes';
import { EyeSVG, SearchSVG, XSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { toggleAddSymbolToWatchlistModal } from '@/features/slices/modalSlice';
import { getOptionWatchlistTabId } from '@/features/slices/tabSlice';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import styled from 'styled-components';
import Modal from '../Modal';

const Div = styled.div`
	width: 496px;
	height: 600px;
	display: flex;
	flex-direction: column;
`;

const AddSymbolToWatchlist = () => {
	const inputRef = useRef<HTMLInputElement>(null);

	const watchlistId = useAppSelector(getOptionWatchlistTabId);

	const queryClient = useQueryClient();

	const dispatch = useAppDispatch();

	const t = useTranslations();

	const [term, setTerm] = useState('');

	const { data: symbolsData, isFetching } = useOptionSymbolSearchQuery({
		queryKey: ['optionSymbolSearchQuery', { term, id: watchlistId }],
	});

	const onCloseModal = () => {
		dispatch(toggleAddSymbolToWatchlistModal(false));
	};

	const onAddSymbol = async (symbol: Symbol.Search) => {
		try {
			if (!symbol.symbolISIN || watchlistId === -1) return;

			const response = await axios.post<ServerResponse<string>>(routes.optionWatchlist.AddSymbolCustomWatchlist, {
				id: watchlistId,
				symbolISINs: [symbol.symbolISIN],
			});
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			queryClient.refetchQueries({
				queryKey: ['optionWatchlistQuery'],
				exact: false,
			});
		} catch (e) {
			//
		}
	};

	const onDeleteSymbol = async (symbol: Symbol.Search) => {
		try {
			if (!symbol.symbolISIN || watchlistId === -1) return;

			const response = await axios.post<ServerResponse<string>>(
				routes.optionWatchlist.RemoveSymbolCustomWatchlist,
				{
					id: watchlistId,
					symbolISIN: symbol.symbolISIN,
				},
			);
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');
		} catch (e) {
			//
		}
	};

	return (
		<Modal style={{ modal: { transform: 'translate(-50%, -50%)' } }} top='50%' onClose={onCloseModal}>
			<Div className='bg-white'>
				<div className='relative h-72 border-b border-gray-500 flex-justify-center'>
					<h2 className='text-xl font-medium text-gray-1000'>{t('add_symbol_to_watchlist.title')}</h2>

					<button
						onClick={onCloseModal}
						style={{ left: '1.6rem' }}
						type='button'
						className='absolute top-1/2 -translate-y-1/2 transform p-8 icon-hover'
					>
						<XSVG width='1.6rem' height='1.6rem' />
					</button>
				</div>

				<div className='flex-1 gap-24 overflow-hidden rounded p-24 flex-column'>
					<div className='input-group h-40 rounded border border-gray-500 flex-items-center'>
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
							onChange={(e) => setTerm(e.target.value)}
						/>

						{isFetching ? (
							<div className='spinner ml-16 min-h-20 min-w-20' />
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
								<XSVG width='0.8rem' height='0.8rem' />
							</button>
						)}
					</div>

					<div className='relative flex-1 overflow-hidden rounded border border-gray-500'>
						{term.length < 2 ? (
							<div className='absolute center'>
								<span className='font-medium text-gray-900'>
									{t('add_symbol_to_watchlist.type_min_chars', { n: 2 })}
								</span>
							</div>
						) : isFetching ? (
							<div className='spinner absolute size-48 center' />
						) : !Array.isArray(symbolsData) || symbolsData.length === 0 ? (
							<div className='absolute center'>
								<span className='font-medium text-gray-900'>
									{t('add_symbol_to_watchlist.no_symbol_found')}
								</span>
							</div>
						) : (
							<ul className='h-full gap-4 overflow-auto flex-column'>
								{symbolsData?.map((item) => (
									<li key={item.symbolISIN}>
										<button
											onClick={() => onAddSymbol(item)}
											type='button'
											className='h-48 w-full px-16 transition-colors flex-justify-between hover:bg-primary-100'
										>
											<span className='text-base font-medium text-gray-1000'>
												{item.symbolTitle}
											</span>
											<span className='text-base font-medium text-gray-900'>
												<EyeSVG width='2rem' height='2rem' />
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
