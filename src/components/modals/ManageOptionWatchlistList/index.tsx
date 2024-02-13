import axios from '@/api/axios';
import { useGetAllCustomWatchlistQuery } from '@/api/queries/optionQueries';
import routes from '@/api/routes';
import { PlusSquareSVG, TrashSVG, XSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { toggleAddNewOptionWatchlist, toggleManageOptionWatchlistList } from '@/features/slices/modalSlice';
import { getOptionWatchlistTabId } from '@/features/slices/tabSlice';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import styled from 'styled-components';
import Modal from '../Modal';
import Watchlist from './Watchlist';

const Div = styled.div`
	width: 472px;
	height: 552px;
`;

const getAllCustomWatchlistQueryKey: ['getAllCustomWatchlistQuery'] = ['getAllCustomWatchlistQuery'];

const ManageOptionWatchlistList = () => {
	const t = useTranslations();

	const queryClient = useQueryClient();

	const dispatch = useAppDispatch();

	const optionWatchlistTabId = useAppSelector(getOptionWatchlistTabId);

	const [editingWatchlistId, setEditingWatchlistId] = useState(-1);

	const { data: watchlistList } = useGetAllCustomWatchlistQuery({
		queryKey: getAllCustomWatchlistQueryKey,
	});

	const updateWatchlistCache = (
		id: Option.WatchlistList['id'],
		watchlist: Partial<Omit<Option.WatchlistList, 'id'>>,
		callback?: (item: Option.WatchlistList) => Option.WatchlistList,
	) => {
		try {
			const data = JSON.parse(JSON.stringify(watchlistList) ?? []) as Option.WatchlistList[];

			queryClient.setQueryData(
				getAllCustomWatchlistQueryKey,
				data.map((item) => {
					if (item.id === id) return { ...item, ...watchlist };
					return callback ? callback(item) : item;
				}),
			);
		} catch (e) {
			//
		}
	};

	const onClose = () => {
		dispatch(toggleManageOptionWatchlistList(false));
	};

	const onEditStart = (watchlist: Option.WatchlistList) => {
		setEditingWatchlistId(watchlist.id);
	};

	const onEditEnd = async (watchlist: Option.WatchlistList, name: string) => {
		try {
			updateWatchlistCache(watchlist.id, { name });

			await axios.post(routes.optionWatchlist.UpdateCustomWatchlist, {
				id: watchlist.id,
				name,
			});
		} catch (e) {
			//
		} finally {
			setEditingWatchlistId(-1);
		}
	};

	const onDelete = async (watchlist: Option.WatchlistList) => {
		try {
			const data = JSON.parse(JSON.stringify(watchlistList) ?? []) as Option.WatchlistList[];

			queryClient.setQueryData(
				getAllCustomWatchlistQueryKey,
				data.filter((item) => item.id !== watchlist.id),
			);
		} catch (e) {
			//
		}

		try {
			await axios.post(routes.optionWatchlist.DeleteCustomWatchlist, {
				ids: [watchlist.id],
			});
		} catch (e) {
			//
		}
	};

	const onVisibilityChange = async ({ id, isHidden }: Option.WatchlistList) => {
		try {
			const hidden = !isHidden;

			updateWatchlistCache(id, { isHidden: hidden });

			await axios.post(routes.optionWatchlist.ChangeHiddenCustomWatchlist, {
				id,
				isHidden: hidden,
			});
		} catch (e) {
			//
		}
	};

	const addNewWatchlist = () => {
		dispatch(toggleAddNewOptionWatchlist(true));
	};

	return (
		<Modal transparent style={{ modal: { transform: 'translate(-50%, -50%)' } }} top='50%' onClose={onClose}>
			<Div className='justify-between bg-white flex-column'>
				<div className='relative h-56 border-b border-b-gray-500 flex-justify-center'>
					<h2 className='text-xl font-medium'>{t('manage_option_watchlist_modal.title')}</h2>

					<button onClick={onClose} type='button' className='absolute left-24 z-10 text-gray-900'>
						<XSVG width='1.6rem' height='1.6rem' />
					</button>
				</div>

				{!Array.isArray(watchlistList) || watchlistList.length === 0 ? null : (
					<div className='flex-1 gap-16 overflow-hidden pb-16 pt-40 flex-column'>
						<div className='px-24'>
							<div className='border-b border-b-gray-500 pb-12 flex-justify-between'>
								<span className='text-base font-medium text-gray-900'>
									{t('manage_option_watchlist_modal.watchlist_count', {
										count: watchlistList.length,
									})}
								</span>
								<button className='text-gray-1000' type='button'>
									<TrashSVG width='2rem' height='2rem' />
								</button>
							</div>
						</div>

						<ul className='gap-16 overflow-auto px-24 flex-column'>
							{watchlistList.map((wl) => (
								<Watchlist
									key={wl.id}
									watchlist={wl}
									isActive={optionWatchlistTabId === wl.id}
									isEditing={wl.id === editingWatchlistId}
									onEditStart={() => onEditStart(wl)}
									onEditCancel={() => setEditingWatchlistId(-1)}
									onEditEnd={(name: string) => onEditEnd(wl, name)}
									onDelete={() => onDelete(wl)}
									onVisibilityChange={() => onVisibilityChange(wl)}
								/>
							))}
						</ul>
					</div>
				)}

				<div className='gap-8 border-t border-t-gray-500 pl-24'>
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
};

export default ManageOptionWatchlistList;
