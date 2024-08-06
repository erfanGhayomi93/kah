import {
	useDeleteCustomWatchlistMutation,
	useUpdateCustomWatchlistHiddenMutation,
	useUpdateCustomWatchlistNameMutation,
	useUpdateCustomWatchlistOrderMutation,
} from '@/api/mutations/watchlistMutations';
import { useGetAllCustomWatchlistQuery } from '@/api/queries/optionQueries';
import Checkbox from '@/components/common/Inputs/Checkbox';
import { useAppDispatch } from '@/features/hooks';
import {
	setAddNewOptionWatchlistModal,
	setConfirmModal,
	setManageOptionWatchlistListModal,
} from '@/features/slices/modalSlice';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { forwardRef, useEffect, useState } from 'react';
import ReactGridLayout, { type Layout } from 'react-grid-layout';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';
import AddNewWatchlist from './AddNewWatchlist';
import DeleteWatchlistBtnGroup from './DeleteWatchlistBtnGroup';
import Watchlist from './Watchlist';

const Div = styled.div`
	width: 500px;
	height: 552px;
`;

interface ManageOptionWatchlistListProps extends IBaseModalConfiguration {}

const ManageOptionWatchlistList = forwardRef<HTMLDivElement, ManageOptionWatchlistListProps>((props, ref) => {
	const t = useTranslations();

	const queryClient = useQueryClient();

	const dispatch = useAppDispatch();

	const [selectedWatchlist, setSelectedWatchlist] = useState<number[]>([]);

	const [editingId, setEditingId] = useState<number>(-1);

	const { data = [] } = useGetAllCustomWatchlistQuery({
		queryKey: ['getAllCustomWatchlistQuery'],
	});

	const { mutate: deleteWatchlist } = useDeleteCustomWatchlistMutation({
		onSuccess: (_d, watchlistIds) => {
			const newData = JSON.parse(JSON.stringify(data)) as Option.WatchlistList[];
			queryClient.setQueryData(
				['getAllCustomWatchlistQuery'],
				newData.filter((wl) => !watchlistIds.includes(wl.id)),
			);

			toast.success(t('alerts.watchlist_removed_successfully'), {
				toastId: 'watchlist_removed_successfully',
			});

			setSelectedWatchlist([]);
		},

		onError: () => {
			toast.error(t('alerts.watchlist_removed_failed'), {
				toastId: 'watchlist_removed_failed',
			});
		},
	});

	const { mutate: updateWatchlistName } = useUpdateCustomWatchlistNameMutation({
		onSuccess: (_d, { watchlistId, name }) => {
			queryClient.setQueryData(
				['getAllCustomWatchlistQuery'],
				data.map((wl) => {
					if (wl.id === watchlistId) return wl;
					return { ...wl, name };
				}),
			);

			toast.success(t('alerts.watchlist_renamed_successfully'), {
				toastId: 'watchlist_renamed_successfully',
			});

			setEditingId(-1);
		},

		onError: () => {
			toast.error(t('alerts.watchlist_renamed_failed'), {
				toastId: 'watchlist_renamed_failed',
			});
		},
	});

	const { mutate: updateWatchlistOrder } = useUpdateCustomWatchlistOrderMutation({
		onSuccess: (_d, { orders }) => {
			const newData = JSON.parse(JSON.stringify(data)) as Option.WatchlistList[];
			newData.sort((a, b) => orders[b.id] - orders[a.id]);

			queryClient.setQueryData(['getAllCustomWatchlistQuery'], newData);
		},
	});

	const { mutate: updateWatchlistVisibility } = useUpdateCustomWatchlistHiddenMutation({
		onSuccess: (_s, { id, isHidden }) => {
			queryClient.setQueryData(
				['getAllCustomWatchlistQuery'],
				data.map((wl) => {
					if (!id.includes(wl.id)) return wl;
					return { ...wl, isHidden };
				}),
			);
		},
	});

	const onCloseModal = () => {
		dispatch(setManageOptionWatchlistListModal(null));
	};

	const toggleAll = (checked: boolean) => {
		if (!checked) setSelectedWatchlist([]);
		else {
			setSelectedWatchlist(data.map((wl) => wl.id));
		}
	};

	const addNewWatchlist = () => {
		dispatch(setAddNewOptionWatchlistModal({ moveable: true }));
	};

	const onToggleVisibility = (wl: Option.WatchlistList) => {
		updateWatchlistVisibility({ id: [wl.id], isHidden: !wl.isHidden });
	};

	const onChange = (wl: Option.WatchlistList) => {
		const exists = selectedWatchlist.includes(wl.id);

		if (exists) setSelectedWatchlist(selectedWatchlist.filter((id) => wl.id !== id));
		else setSelectedWatchlist([...selectedWatchlist, wl.id]);
	};

	const onLayoutChange = (newLayout: Layout[]) => {
		const orders: Record<number, number> = {};
		for (let i = 0; i < newLayout.length; i++) {
			const item = newLayout[i];
			const id = Number(item.i.split('_')[1]);
			orders[id] = item.y;
		}

		updateWatchlistOrder({ orders });
	};

	const onDelete = (watchlistsId: number[]) => {
		let name = '';
		if (watchlistsId.length === 1) name = data.find((wl) => wl.id === watchlistsId[0])?.name ?? '';

		dispatch(
			setConfirmModal({
				description: t(
					`manage_option_watchlist_modal.${watchlistsId.length === 1 ? 'delete_single_watchlist' : 'delete_multiple_question'}`,
					{ n: name },
				),
				confirm: {
					label: t('common.delete'),
					type: 'error',
				},
				onCancel: () => dispatch(setConfirmModal(null)),
				onSubmit: () => deleteWatchlist(watchlistsId),
			}),
		);
	};

	useEffect(() => {
		if (Array.isArray(data) && data.length === 0) onCloseModal();
	}, [data]);

	const isDeleting = selectedWatchlist.length > 0;

	return (
		<Modal
			top='50%'
			transparent
			style={{ modal: { transform: 'translate(-50%, -50%)' } }}
			onClose={onCloseModal}
			{...props}
			ref={ref}
		>
			<Div className='justify-between bg-white flex-column darkBlue:bg-gray-50 dark:bg-gray-50'>
				<Header label={t('manage_option_watchlist_modal.title')} onClose={onCloseModal} />

				<div className='flex-1 overflow-hidden px-24 pt-24 flex-column'>
					<div className='flex-64 select-none border-b border-b-gray-200 px-8 flex-justify-start'>
						<Checkbox
							checked={selectedWatchlist.length === data.length}
							onChange={toggleAll}
							label={
								<>
									{t('manage_option_watchlist_modal.total_count')}:
									<span className='text-gray-800'>
										{' '}
										{t('manage_option_watchlist_modal.watchlist_count', { n: data.length })}
									</span>
								</>
							}
						/>
					</div>

					<div className='flex-1 overflow-y-auto overflow-x-hidden'>
						<ReactGridLayout
							draggableHandle='.drag-handler'
							compactType='vertical'
							className='relative'
							isResizable={false}
							allowOverlap={false}
							margin={[8, 0]}
							cols={1}
							rowHeight={64}
							width={452}
							useCSSTransforms={false}
							onLayoutChange={onLayoutChange}
						>
							{data.map((wl) => (
								<div key={`wl_${wl.id}`}>
									<Watchlist
										hideCheckbox={editingId > -1}
										editing={editingId === wl.id}
										checked={selectedWatchlist.includes(wl.id)}
										cancelEdit={() => setEditingId(-1)}
										applyEdit={(name) => updateWatchlistName({ watchlistId: wl.id, name })}
										onEdit={() => {
											setEditingId(wl.id);
											setSelectedWatchlist([]);
										}}
										onToggleVisibility={() => onToggleVisibility(wl)}
										onDelete={() => onDelete([wl.id])}
										onChange={() => onChange(wl)}
										{...wl}
									/>
								</div>
							))}
						</ReactGridLayout>
					</div>
				</div>

				{isDeleting ? (
					<DeleteWatchlistBtnGroup
						count={selectedWatchlist.length}
						onCancel={() => setSelectedWatchlist([])}
						onDelete={() => onDelete(selectedWatchlist)}
					/>
				) : (
					<AddNewWatchlist onClick={addNewWatchlist} />
				)}
			</Div>
		</Modal>
	);
});

export default ManageOptionWatchlistList;
