import { useCreateCustomWatchlistMutation } from '@/api/mutations/watchlistMutations';
import { useGetAllCustomWatchlistQuery } from '@/api/queries/optionQueries';
import Button from '@/components/common/Button';
import { useAppDispatch } from '@/features/hooks';
import { setAddNewOptionWatchlistModal } from '@/features/slices/modalSlice';
import { cn } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { forwardRef, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';

const Div = styled.div`
	width: 336px;
	display: flex;
	gap: 3.6rem;
	flex-direction: column;
	align-items: center;
	text-align: center;
`;

interface AddNewOptionWatchlistProps extends IBaseModalConfiguration {}

const AddNewOptionWatchlist = forwardRef<HTMLDivElement, AddNewOptionWatchlistProps>((props, ref) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const [name, setName] = useState('');

	const { refetch: refetchWatchlistList } = useGetAllCustomWatchlistQuery({
		queryKey: ['getAllCustomWatchlistQuery'],
	});

	const { mutate: createNewWatchlist, isPending } = useCreateCustomWatchlistMutation({
		onSuccess: () => {
			refetchWatchlistList();

			toast.success(t('alerts.watchlist_created_successfully'), {
				toastId: 'watchlist_created_successfully',
			});

			onCloseModal();
		},
		onError: (e) => {
			toast.error(
				t(
					e.message === 'Duplicate Name'
						? 'alerts.watchlist_name_duplicated'
						: 'alerts.watchlist_created_failed',
				),
				{
					toastId: 'watchlist_created_failed',
				},
			);
		},
	});

	const onCloseModal = () => {
		dispatch(setAddNewOptionWatchlistModal(null));
	};

	const valueFormatter = (v: string) => {
		return v.replace(/^\s*/g, '');
	};

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		createNewWatchlist(name);
	};

	const placeholder = t('add_new_option_watchlist_modal.input_placeholder');

	return (
		<Modal
			transparent
			style={{ modal: { transform: 'translate(-50%, -50%)' } }}
			top='50%'
			onClose={onCloseModal}
			{...props}
			ref={ref}
		>
			<Div className='bg-white darkness:bg-gray-50'>
				<Header onClose={onCloseModal} label={t('add_new_option_watchlist_modal.title')} />

				<form method='get' onSubmit={onSubmit} className='w-full flex-1 gap-36 px-32 pb-24 flex-column'>
					<label className='relative h-40 rounded flex-items-center input-group'>
						<input
							autoFocus
							type='text'
							maxLength={36}
							value={name}
							className='h-40 w-full rounded px-16 text-base'
							onChange={(e) => setName(valueFormatter(e.target.value))}
						/>

						<span className={cn('flexible-placeholder', name && 'active')}>{placeholder}</span>

						<fieldset className={cn('flexible-fieldset', name && 'active')}>
							<legend>{placeholder}</legend>
						</fieldset>
					</label>

					<div className='w-full gap-8 flex-justify-center'>
						<Button
							loading={isPending}
							disabled={name.length === 0}
							type='submit'
							className='h-40 flex-1 rounded text-lg font-medium btn-primary'
						>
							{t('common.register')}
						</Button>
					</div>
				</form>
			</Div>
		</Modal>
	);
});

export default AddNewOptionWatchlist;
