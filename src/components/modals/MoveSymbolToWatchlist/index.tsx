import { useToggleCustomWatchlistSymbolMutation } from '@/api/mutations/watchlistMutations';
import { useGetAllCustomWatchlistQuery } from '@/api/queries/optionQueries';
import { useSymbolWatchlistListQuery } from '@/api/queries/symbolQuery';
import Loading from '@/components/common/Loading';
import { useAppDispatch } from '@/features/hooks';
import { setAddNewOptionWatchlistModal, setMoveSymbolToWatchlistModal } from '@/features/slices/modalSlice';
import { type IMoveSymbolToWatchlistModal } from '@/features/slices/types/modalSlice.interfaces';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { forwardRef } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';
import AddNewWatchlist from './AddNewWatchlist';
import Watchlist from './Watchlist';

const Div = styled.div`
	width: 472px;
	height: 552px;
`;

interface MoveSymbolToWatchlistProps extends IMoveSymbolToWatchlistModal {}

const MoveSymbolToWatchlist = forwardRef<HTMLDivElement, MoveSymbolToWatchlistProps>(
	({ symbolISIN, symbolTitle, ...props }, ref) => {
		const t = useTranslations();

		const queryClient = useQueryClient();

		const dispatch = useAppDispatch();

		const { data: watchlistList = [], isLoading: isLoadingWatchlistList } = useGetAllCustomWatchlistQuery({
			queryKey: ['getAllCustomWatchlistQuery'],
		});

		const { data: symbolWatchlistList = [], isLoading: isLoadingSymbolWatchlistList } = useSymbolWatchlistListQuery(
			{
				queryKey: ['symbolWatchlistListQuery', symbolISIN],
			},
		);

		const { mutate } = useToggleCustomWatchlistSymbolMutation({
			onSuccess: (_d, { watchlist, action }) => {
				toast.success(
					t(action === 'add' ? 'alerts.symbol_added_successfully' : 'alerts.symbol_removed_successfully'),
					{
						toastId: action === 'add' ? 'symbol_added_successfully' : 'symbol_removed_successfully',
					},
				);

				if (watchlist) updateCache(watchlist, action);
			},
			onError: (_e, { action }) => {
				toast.error(t(action === 'add' ? 'alerts.symbol_added_failed' : 'alerts.symbol_removed_failed'), {
					toastId: action === 'add' ? 'symbol_added_failed' : 'symbol_removed_failed',
				});
			},
		});

		const onCloseModal = () => {
			dispatch(setMoveSymbolToWatchlistModal(null));
		};

		const updateCache = (wl: Option.WatchlistList, action: 'add' | 'remove') => {
			try {
				queryClient.refetchQueries({
					queryKey: ['optionWatchlistQuery', { watchlistId: wl.id }],
					exact: false,
				});

				let list = JSON.parse(JSON.stringify(symbolWatchlistList)) as typeof symbolWatchlistList;

				if (action === 'add') list.push(wl);
				else list = list.filter((item) => item.id !== wl.id);

				queryClient.setQueryData(['symbolWatchlistListQuery', symbolISIN], list);
			} catch (e) {
				//
			}
		};

		const addNewWatchlist = () => {
			dispatch(setAddNewOptionWatchlistModal({ moveable: true }));
		};

		const isExistsInWatchlist = (watchlistId: number) => {
			return symbolWatchlistList.findIndex((item) => item.id === watchlistId) > -1;
		};

		return (
			<Modal
				style={{ modal: { transform: 'translate(-50%, -50%)' } }}
				top='50%'
				onClose={onCloseModal}
				{...props}
				ref={ref}
			>
				<Div className='justify-between bg-white flex-column darkness:bg-gray-50'>
					<Header
						label={t.rich('move_symbol_to_watchlist.title', {
							symbolTitle: () => <span className='font-medium text-primary-100'>{symbolTitle}</span>,
						})}
						onClose={onCloseModal}
					/>

					<div className='relative flex-1 overflow-hidden p-24 flex-column'>
						{(isLoadingWatchlistList || isLoadingSymbolWatchlistList) && <Loading />}

						{Array.isArray(watchlistList) && (
							<ul className='relative w-full flex-1 select-none gap-16 overflow-y-auto overflow-x-hidden flex-column'>
								{watchlistList.map((wl, i) => {
									const exists = isExistsInWatchlist(wl.id);

									return (
										<Watchlist
											key={wl.id}
											top={i * 6.4}
											watchlist={wl}
											isActive={exists}
											onSelect={() =>
												mutate({
													watchlist: wl,
													watchlistId: wl.id,
													symbolISIN,
													action: exists ? 'remove' : 'add',
												})
											}
										/>
									);
								})}

								<li
									style={{ top: `${watchlistList.length * 6.4}rem` }}
									className='absolute left-0 h-4 w-full'
								/>
							</ul>
						)}
					</div>

					<AddNewWatchlist onClick={addNewWatchlist} />
				</Div>
			</Modal>
		);
	},
);

export default MoveSymbolToWatchlist;
