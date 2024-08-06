import { useToggleCustomWatchlistSymbolMutation } from '@/api/mutations/watchlistMutations';
import { useCustomWatchlistSymbolSearch } from '@/api/queries/optionQueries';
import NoData from '@/components/common/NoData';
import { SearchSVG, TriangleWarningSVG, XCircleSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setAddSymbolToWatchlistModal } from '@/features/slices/modalSlice';
import { getOptionWatchlistTabId } from '@/features/slices/tabSlice';
import { cn } from '@/utils/helpers';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { forwardRef, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';
import SymbolItem from './SymbolItem';

const Div = styled.div`
	width: 600px;
	height: 600px;
	display: flex;
	flex-direction: column;
`;

interface WarningMessageProps {
	active: boolean;
	message: string;
}

interface AddSymbolToWatchlistProps extends IBaseModalConfiguration {}

const AddSymbolToWatchlist = forwardRef<HTMLDivElement, AddSymbolToWatchlistProps>((props, ref) => {
	const inputRef = useRef<HTMLInputElement>(null);

	const queryClient = useQueryClient();

	const watchlistId = useAppSelector(getOptionWatchlistTabId);

	const dispatch = useAppDispatch();

	const t = useTranslations();

	const [term, setTerm] = useState('');

	const [symbolIsInWatchlist, setSymbolIsInWatchlist] = useState<Record<string, boolean>>({});

	const { data: symbolsData = [], isFetching } = useCustomWatchlistSymbolSearch({
		queryKey: ['customWatchlistSymbolSearch', { term, id: watchlistId }],
		enabled: term.length > 1,
	});

	const { mutate } = useToggleCustomWatchlistSymbolMutation({
		onSuccess: (_d, { symbolISIN, action }) => {
			toast.success(
				t(action === 'add' ? 'alerts.symbol_added_successfully' : 'alerts.symbol_removed_successfully'),
				{
					toastId: action === 'add' ? 'symbol_added_successfully' : 'symbol_removed_successfully',
				},
			);

			updateCache(symbolISIN, action);
		},
		onError: (_e, { action }) => {
			toast.error(t(action === 'add' ? 'alerts.symbol_added_failed' : 'alerts.symbol_removed_failed'), {
				toastId: action === 'add' ? 'symbol_added_failed' : 'symbol_removed_failed',
			});
		},
	});

	const updateCache = (symbolISIN: string, action: 'add' | 'remove') => {
		try {
			setSymbolIsInWatchlist((prev) => ({
				...prev,
				[symbolISIN]: action === 'add',
			}));

			queryClient.refetchQueries({
				queryKey: ['optionWatchlistQuery', { watchlistId }],
				exact: false,
			});
		} catch (e) {
			//
		}
	};

	const onCloseModal = () => {
		dispatch(setAddSymbolToWatchlistModal(null));
	};

	const placeholder = t('option_watchlist_filters_modal.base_symbol_placeholder');

	const hasWarning = term.length < 2;

	return (
		<Modal
			style={{ modal: { transform: 'translate(-50%, -50%)' } }}
			top='50%'
			onClose={onCloseModal}
			{...props}
			ref={ref}
		>
			<Div className='bg-white darkBlue:bg-gray-50 dark:bg-gray-50'>
				<Header label={t('add_symbol_to_watchlist.title')} onClose={onCloseModal} />

				<div className='flex-1 gap-12 overflow-hidden rounded p-24 flex-column'>
					<div className='gap-8 flex-column'>
						<div
							className={clsx(
								'relative h-40 rounded flex-items-center input-group',
								hasWarning && 'warning',
							)}
						>
							<span className='px-8 text-gray-700'>
								<SearchSVG width='2rem' height='2rem' />
							</span>
							<input
								autoFocus
								ref={inputRef}
								type='text'
								inputMode='numeric'
								maxLength={32}
								className='h-40 flex-1 pl-8 text-gray-800'
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
									className='ml-16 text-gray-700 transition-opacity'
								>
									<XCircleSVG width='1.6rem' height='1.6rem' />
								</button>
							)}
						</div>

						<WarningMessage active={hasWarning} message={t('common.needs_more_than_n_chars', { n: 2 })} />
					</div>

					<div className='relative flex-1 overflow-hidden rounded border border-gray-200'>
						{!Array.isArray(symbolsData) || symbolsData.length === 0 ? (
							<NoData />
						) : (
							<ul className='h-full gap-4 overflow-auto flex-column'>
								{symbolsData.map((item) => (
									<SymbolItem
										{...item}
										isInWatchlist={symbolIsInWatchlist?.[item.symbolISIN] ?? item.isInWatchlist}
										key={item.symbolISIN}
										onClick={() =>
											mutate({
												action:
													symbolIsInWatchlist?.[item.symbolISIN] ?? item.isInWatchlist
														? 'remove'
														: 'add',
												symbolISIN: item.symbolISIN,
												watchlistId,
											})
										}
									/>
								))}
							</ul>
						)}
					</div>
				</div>
			</Div>
		</Modal>
	);
});

const WarningMessage = ({ active, message }: WarningMessageProps) => (
	<div className={clsx('h-18 gap-6 text-warning-100 transition-opacity flex-items-center', !active && 'opacity-0')}>
		<TriangleWarningSVG width='1.6rem' height='1.6rem' />
		<span className='text-tiny'>{message}</span>
	</div>
);

export default AddSymbolToWatchlist;
