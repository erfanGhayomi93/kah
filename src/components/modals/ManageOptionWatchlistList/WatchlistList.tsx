import axios from '@/api/axios';
import routes from '@/api/routes';
import { useAppDispatch } from '@/features/hooks';
import { setOptionWatchlistTabId } from '@/features/slices/tabSlice';
import { useQueryClient } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import Watchlist from './Watchlist';

interface IDeleting {
	hasStarted: boolean;
	selected: number[];
}

interface WatchlistListProps {
	watchlistList: Option.WatchlistList[];
	isDeleting: IDeleting;
	setIsDeleting: React.Dispatch<{
		type: keyof IDeleting;
		payload: boolean | number[];
	}>;
}

const getAllCustomWatchlistQueryKey = ['getAllCustomWatchlistQuery'];

const WatchlistList = ({ watchlistList, isDeleting, setIsDeleting }: WatchlistListProps) => {
	const listRef = useRef<HTMLUListElement>(null);

	const draggedOverItem = useRef<number>(-1);

	const queryClient = useQueryClient();

	const dispatch = useAppDispatch();

	const [editingWatchlistId, setEditingWatchlistId] = useState(-1);

	const [dragItemIndex, setDragItemIndex] = useState(-1);

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

	const onEditStart = (watchlist: Option.WatchlistList) => {
		setEditingWatchlistId(watchlist.id);
	};

	const onEditEnd = async (watchlist: Option.WatchlistList, name: string) => {
		try {
			if (!name) return;

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

	const onDragStart = (e: React.DragEvent, index: number) => {
		e.dataTransfer.effectAllowed = 'copy';
		setTimeout(() => setDragItemIndex(index), 0);
	};

	const onDragEnter = (e: React.DragEvent, index: number) => {
		draggedOverItem.current = index;
		e.preventDefault();
	};

	const onDragEnd = () => {
		const draggedOverIndex = draggedOverItem.current;
		if (dragItemIndex === -1 || draggedOverIndex === -1) return;

		try {
			const list = [...watchlistList];
			const temp = list[dragItemIndex];
			list[dragItemIndex] = list[draggedOverIndex];
			list[draggedOverIndex] = temp;

			queryClient.setQueryData(getAllCustomWatchlistQueryKey, list);

			try {
				const orders: Record<number, number> = {};
				for (let i = 0; i < list.length; i++) {
					orders[list[i].id] = i;
				}

				axios.post(routes.optionWatchlist.UpdateCustomWatchlistOrder, { orders });
			} catch (e) {
				//
			}
		} catch (e) {
			//
		} finally {
			setDragItemIndex(-1);
		}
	};

	return (
		<ul
			ref={listRef}
			onDragOver={(e) => e.preventDefault()}
			onDragEnter={(e) => {
				e.dataTransfer.dropEffect = 'copy';
				e.preventDefault();
			}}
			className='relative flex-1 select-none overflow-auto'
		>
			{watchlistList.map((wl, index) => (
				<Watchlist
					key={wl.id}
					watchlist={wl}
					checked={isDeleting.hasStarted ? isDeleting.selected.includes(wl.id) : undefined}
					isEditing={wl.id === editingWatchlistId}
					onChecked={(checked) => onCheckedWatchlist(wl, checked)}
					onSelect={() => onSelect(wl)}
					onEditStart={() => onEditStart(wl)}
					onEditCancel={() => setEditingWatchlistId(-1)}
					onEditEnd={(name: string) => onEditEnd(wl, name)}
					onDelete={() => onDelete(wl)}
					onVisibilityChange={() => onVisibilityChange(wl)}
					// LI
					draggable
					onDragStart={(e) => onDragStart(e, index)}
					onDragEnter={(e) => onDragEnter(e, index)}
					onDragEnd={onDragEnd}
					style={{
						top: `${index * 6.4 + 1.6}rem`,
						transition: 'top 250ms ease-in-out, opacity 200ms',
						opacity: dragItemIndex === index ? 0.5 : 1,
					}}
					className='absolute left-0 h-48 w-full select-none px-24'
				/>
			))}
			<li style={{ top: `${watchlistList.length * 6.4 + 1.2}rem` }} className='absolute left-0 h-4 w-full' />
		</ul>
	);
};

export default WatchlistList;
