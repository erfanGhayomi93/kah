import axios from '@/api/axios';
import { useGetAllCustomWatchlistQuery } from '@/api/queries/optionQueries';
import routes from '@/api/routes';
import Checkbox from '@/components/common/Inputs/Checkbox';
import { PlusSquareSVG, TrashSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { toggleAddNewOptionWatchlist, toggleManageOptionWatchlistListModal } from '@/features/slices/modalSlice';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { forwardRef, useLayoutEffect, useReducer } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';
import WatchlistList from './WatchlistList';

const Div = styled.div`
	width: 472px;
	height: 552px;
`;

interface IDeleting {
	hasStarted: boolean;
	selected: number[];
}

interface ManageOptionWatchlistListProps extends IBaseModalConfiguration {}

const ManageOptionWatchlistList = forwardRef<HTMLDivElement, ManageOptionWatchlistListProps>((props, ref) => {
	const t = useTranslations();

	const queryClient = useQueryClient();

	const dispatch = useAppDispatch();

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
		queryKey: ['getAllCustomWatchlistQuery'],
	});

	const onCloseModal = () => {
		dispatch(toggleManageOptionWatchlistListModal(null));
	};

	const deleteAll = () => {
		if (isDeleting.selected.length === 0) return;

		try {
			const data = JSON.parse(JSON.stringify(watchlistList) ?? []) as Option.WatchlistList[];

			queryClient.setQueryData(
				['getAllCustomWatchlistQuery'],
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
		dispatch(toggleAddNewOptionWatchlist({ moveable: true }));
	};

	useLayoutEffect(() => {
		if (Array.isArray(watchlistList) && watchlistList.length === 0) onCloseModal();
	}, [watchlistList]);

	return (
		<Modal
			transparent
			style={{ modal: { transform: 'translate(-50%, -50%)' } }}
			top='50%'
			onClose={onCloseModal}
			{...props}
			ref={ref}
		>
			<Div className='justify-between bg-white flex-column'>
				<Header label={t('manage_option_watchlist_modal.title')} onClose={onCloseModal} />

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

						<WatchlistList
							isDeleting={isDeleting}
							setIsDeleting={setIsDeleting}
							watchlistList={watchlistList ?? []}
						/>
					</div>
				)}

				<div className='h-64 gap-8 border-t border-t-gray-500 pl-24 flex-items-center'>
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
});

export default ManageOptionWatchlistList;
