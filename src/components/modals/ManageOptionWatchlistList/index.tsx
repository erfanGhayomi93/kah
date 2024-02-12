import { useGetAllCustomWatchlistQuery } from '@/api/queries/optionQueries';
import { PlusSVG, TrashSVG, XSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { toggleManageOptionWatchlistList } from '@/features/slices/modalSlice';
import { getOptionWatchlistTabId } from '@/features/slices/tabSlice';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import styled from 'styled-components';
import Modal from '../Modal';
import Watchlist from './Watchlist';

const Div = styled.div`
	width: 472px;
	height: 552px;
`;

const ManageOptionWatchlistList = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const optionWatchlistTabId = useAppSelector(getOptionWatchlistTabId);

	const [editingWatchlistId, setEditingWatchlistId] = useState(-1);

	const { data: watchlistList } = useGetAllCustomWatchlistQuery({
		queryKey: ['getAllCustomWatchlistQuery'],
	});

	const onClose = () => {
		dispatch(toggleManageOptionWatchlistList(false));
	};

	const onEditStart = (watchlist: Option.WatchlistList) => {
		setEditingWatchlistId(watchlist.id);
	};

	const onEditEnd = (watchlist: Option.WatchlistList, name: string) => {
		//
	};

	const onDelete = (watchlist: Option.WatchlistList) => {
		//
	};

	const onVisibilityChange = (watchlist: Option.WatchlistList) => {
		//
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
					<button className='h-40 gap-8 pr-24 font-medium text-primary-400 flex-items-center' type='button'>
						<span className='size-16 rounded-sm border-2 border-current text-current flex-justify-center'>
							<PlusSVG width='1.4rem' height='1.4rem' />
						</span>
						{t('manage_option_watchlist_modal.create_new_watchlist')}
					</button>
				</div>
			</Div>
		</Modal>
	);
};

export default ManageOptionWatchlistList;
