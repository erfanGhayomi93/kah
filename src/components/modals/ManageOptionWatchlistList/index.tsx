import axios from '@/api/axios';
import { useGetAllCustomWatchlistQuery } from '@/api/queries/optionQueries';
import routes from '@/api/routes';
import Checkbox from '@/components/common/Inputs/Checkbox';
import { PlusSquareSVG, TrashSVG, XSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { toggleAddNewOptionWatchlist, toggleManageOptionWatchlistList } from '@/features/slices/modalSlice';
import { getOptionWatchlistTabId, setOptionWatchlistTabId } from '@/features/slices/tabSlice';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useLayoutEffect, useReducer, useState } from 'react';
import styled from 'styled-components';
import Modal from '../Modal';
import Watchlist from './Watchlist';

interface IDeleting {
	hasStarted: boolean;
	selected: number[];
}

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

	const [isDeleting, setIsDeleting] = useReducer(
		(state: IDeleting, { type, payload }: { type: keyof IDeleting; payload: boolean | number[] }) => {
			switch (type) {
				case 'hasStarted':
					return { ...state, hasStarted: payload as boolean };
				case 'selected':
					return { ...state, selected: payload as number[] };
				default:
					return state;
			}
		},
		{
			hasStarted: false,
			selected: [],
		},
	);

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
			axios.post(routes.optionWatchlist.DeleteCustomWatchlist, {
				ids: [watchlist.id],
			});
		} catch (e) {
			//
		}
	};

	const onVisibilityChange = ({ id, isHidden }: Option.WatchlistList) => {
		try {
			const hidden = !isHidden;

			updateWatchlistCache(id, { isHidden: hidden });

			axios.post(routes.optionWatchlist.ChangeHiddenCustomWatchlist, {
				id,
				isHidden: hidden,
			});
		} catch (e) {
			//
		}
	};

	const onSelect = async ({ id, isHidden }: Option.WatchlistList) => {
		try {
			dispatch(setOptionWatchlistTabId(id));

			if (isHidden) {
				updateWatchlistCache(id, { isHidden: false });

				await axios.post(routes.optionWatchlist.ChangeHiddenCustomWatchlist, {
					id,
					isHidden: false,
				});
			}
		} catch (e) {
			//
		}
	};

	const onCheckedWatchlist = (watchlist: Option.WatchlistList, checked: boolean) => {
		if (checked) {
			setIsDeleting({ type: 'selected', payload: [...isDeleting.selected, watchlist.id] });
		} else {
			setIsDeleting({ type: 'selected', payload: isDeleting.selected.filter((id) => id !== watchlist.id) });
		}
	};

	const deleteAll = () => {
		if (isDeleting.selected.length === 0) return;

		try {
			const data = JSON.parse(JSON.stringify(watchlistList) ?? []) as Option.WatchlistList[];

			queryClient.setQueryData(
				getAllCustomWatchlistQueryKey,
				data.filter((item) => !isDeleting.selected.includes(item.id)),
			);

			setIsDeleting({ type: 'hasStarted', payload: false });
		} catch (e) {
			//
		}

		try {
			axios.post(routes.optionWatchlist.DeleteCustomWatchlist, {
				ids: isDeleting.selected,
			});
		} catch (e) {
			//
		}
	};

	const toggleAllWatchlist = (checked: boolean) => {
		if (checked) {
			if (Array.isArray(watchlistList))
				setIsDeleting({ type: 'selected', payload: watchlistList.map((wl) => wl.id) });
		} else {
			setIsDeleting({ type: 'selected', payload: [] });
		}
	};

	const addNewWatchlist = () => {
		dispatch(toggleAddNewOptionWatchlist(true));
	};

	useLayoutEffect(() => {
		if (Array.isArray(watchlistList) && watchlistList.length === 0) onClose();
	}, [watchlistList]);

	return (
		<Modal transparent style={{ modal: { transform: 'translate(-50%, -50%)' } }} top='50%' onClose={onClose}>
			<Div className='justify-between bg-white flex-column'>
				<div className='relative h-56 border-b border-b-gray-500 flex-justify-center'>
					<h2 className='text-xl font-medium'>{t('manage_option_watchlist_modal.title')}</h2>

					<button onClick={onClose} type='button' className='absolute left-24 z-10 icon-hover'>
						<XSVG width='1.6rem' height='1.6rem' />
					</button>
				</div>

				{!Array.isArray(watchlistList) || watchlistList.length === 0 ? null : (
					<div className='flex-1 overflow-hidden pt-40 flex-column'>
						<div className='px-24'>
							<div className='border-b border-b-gray-500 pb-12 flex-justify-between'>
								<div className='flex items-center gap-8'>
									{isDeleting.hasStarted && (
										<Checkbox
											checked={isDeleting.selected.length === watchlistList.length}
											onChange={toggleAllWatchlist}
											classes={{
												checkbox: '!size-20 focus:!border-error-100 hover:!border-error-100',
												checked: '!bg-error-100 !border-error-100',
											}}
										/>
									)}
									<span className='text-base font-medium text-gray-900'>
										{t('manage_option_watchlist_modal.watchlist_count', {
											count: watchlistList.length,
										})}
									</span>
								</div>

								<button
									onClick={() => setIsDeleting({ type: 'hasStarted', payload: true })}
									className='text-gray-1000'
									type='button'
								>
									<TrashSVG width='2rem' height='2rem' />
								</button>
							</div>
						</div>

						<ul className='relative flex-1 overflow-auto'>
							{watchlistList.map((wl, index) => (
								<Watchlist
									key={wl.id}
									top={index * 6.4 + 1.6}
									watchlist={wl}
									checked={isDeleting.hasStarted ? isDeleting.selected.includes(wl.id) : undefined}
									onChecked={(checked) => onCheckedWatchlist(wl, checked)}
									isActive={optionWatchlistTabId === wl.id}
									isEditing={wl.id === editingWatchlistId}
									onSelect={() => onSelect(wl)}
									onEditStart={() => onEditStart(wl)}
									onEditCancel={() => setEditingWatchlistId(-1)}
									onEditEnd={(name: string) => onEditEnd(wl, name)}
									onDelete={() => onDelete(wl)}
									onVisibilityChange={() => onVisibilityChange(wl)}
								/>
							))}
							<li
								style={{ top: `${watchlistList.length * 6.4 + 1.2}rem` }}
								className='absolute left-0 h-4 w-full'
							/>
						</ul>
					</div>
				)}

				<div className='h-56 gap-8 border-t border-t-gray-500 pl-24 flex-items-center'>
					{isDeleting.hasStarted ? (
						<div className='w-full gap-8 flex-justify-end'>
							<button
								style={{ width: '8.8rem' }}
								onClick={() => setIsDeleting({ type: 'hasStarted', payload: false })}
								className='h-40 rounded btn-disabled-outline'
								type='button'
							>
								{t('common.cancel')}
							</button>
							<button
								style={{ width: '8.8rem' }}
								onClick={deleteAll}
								className='h-40 rounded btn-error'
								type='button'
							>
								{t('manage_option_watchlist_modal.delete_all')}
							</button>
						</div>
					) : (
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
					)}
				</div>
			</Div>
		</Modal>
	);
};

export default ManageOptionWatchlistList;
