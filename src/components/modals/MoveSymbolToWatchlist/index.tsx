import axios from '@/api/axios';
import { useGetAllCustomWatchlistQuery } from '@/api/queries/optionQueries';
import { useSymbolWatchlistListQuery } from '@/api/queries/symbolQuery';
import routes from '@/api/routes';
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

		const onCloseModal = () => {
			dispatch(setMoveSymbolToWatchlistModal(null));
		};

		const onSelectWatchlist = async (wl: Option.WatchlistList) => {
			try {
				const response = await axios.post<ServerResponse<string>>(
					routes.optionWatchlist.AddSymbolCustomWatchlist,
					{
						id: wl.id,
						symbolISINs: [symbolISIN],
					},
				);
				const data = response.data;

				if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

				toast.success(t('alerts.symbol_added_successfully'), {
					toastId: 'symbol_added_successfully',
				});

				queryClient.refetchQueries({
					queryKey: ['optionWatchlistQuery', { watchlistId: wl.id }],
				});
			} catch (e) {
				//
			}
		};

		const addNewWatchlist = () => {
			dispatch(setAddNewOptionWatchlistModal({ moveable: true }));
		};

		return (
			<Modal
				style={{ modal: { transform: 'translate(-50%, -50%)' } }}
				top='50%'
				onClose={onCloseModal}
				{...props}
				ref={ref}
			>
				<Div className='justify-between bg-white flex-column darkBlue:bg-gray-50 dark:bg-gray-50'>
					<Header label={t('move_symbol_to_watchlist.title', { symbolTitle })} onClose={onCloseModal} />

					<div className='relative flex-1 overflow-hidden flex-column'>
						{(isLoadingWatchlistList || isLoadingSymbolWatchlistList) && <Loading />}

						{Array.isArray(watchlistList) && (
							<ul className='relative flex-1 select-none gap-16 overflow-auto px-24 flex-column'>
								{watchlistList.map((wl, i) => (
									<Watchlist
										key={wl.id}
										top={i * 6.4 + 3.2}
										watchlist={wl}
										onSelect={() => onSelectWatchlist(wl)}
									/>
								))}
								<li
									style={{ top: `${watchlistList.length * 6.4 + 4}rem` }}
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
