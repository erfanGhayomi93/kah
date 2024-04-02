import axios from '@/api/axios';
import { useGetAllCustomWatchlistQuery } from '@/api/queries/optionQueries';
import routes from '@/api/routes';
import Loading from '@/components/common/Loading';
import { PlusSquareSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import {
	toggleAddNewOptionWatchlist,
	toggleMoveSymbolToWatchlistModal,
	type IMoveSymbolToWatchlistModal,
} from '@/features/slices/modalSlice';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { forwardRef } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';
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

		const { data: watchlistList, isLoading } = useGetAllCustomWatchlistQuery({
			queryKey: ['getAllCustomWatchlistQuery'],
		});

		const onCloseModal = () => {
			dispatch(toggleMoveSymbolToWatchlistModal(null));
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

				queryClient.refetchQueries({
					queryKey: ['optionWatchlistQuery', { watchlistId: wl.id }],
				});
			} catch (e) {
				//
			}
		};

		const addNewWatchlist = () => {
			dispatch(toggleAddNewOptionWatchlist({ moveable: true }));
		};

		return (
			<Modal
				style={{ modal: { transform: 'translate(-50%, -50%)' } }}
				top='50%'
				onClose={onCloseModal}
				{...props}
				ref={ref}
			>
				<Div className='justify-between bg-white flex-column'>
					<Header label={t('move_symbol_to_watchlist.title', { symbolTitle })} onClose={onCloseModal} />

					<div className='relative flex-1 overflow-hidden flex-column'>
						{isLoading && <Loading />}

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

					<div className='h-64 gap-8 border-t border-t-gray-500 pl-24 flex-items-center'>
						<button
							onClick={addNewWatchlist}
							className='h-40 gap-8 pr-24 font-medium text-primary-400 flex-items-center'
							type='button'
						>
							<span className='size-16 rounded-sm text-current flex-justify-center'>
								<PlusSquareSVG width='1.6rem' height='1.6rem' />
							</span>
							{t('manage_option_watchlist_modal.create_new_watchlist')}
						</button>
					</div>
				</Div>
			</Modal>
		);
	},
);

export default MoveSymbolToWatchlist;
