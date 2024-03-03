import axios from '@/api/axios';
import { useGetAllCustomWatchlistQuery } from '@/api/queries/optionQueries';
import routes from '@/api/routes';
import Button from '@/components/common/Button';
import { useAppDispatch } from '@/features/hooks';
import { toggleAddNewOptionWatchlist } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import styled from 'styled-components';
import Modal from '../Modal';

const Div = styled.div`
	width: 336px;
	padding: 1.6rem 3.2rem 2.4rem 3.2rem;
	display: flex;
	gap: 2.4rem;
	flex-direction: column;
	align-items: center;
	text-align: center;
`;

interface AddNewOptionWatchlistProps extends IBaseModalConfiguration {}

const AddNewOptionWatchlist = (props: AddNewOptionWatchlistProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const [loading, setLoading] = useState(false);

	const [name, setName] = useState('');

	const { refetch: refetchWatchlistList } = useGetAllCustomWatchlistQuery({
		queryKey: ['getAllCustomWatchlistQuery'],
	});

	const onCloseModal = () => {
		dispatch(toggleAddNewOptionWatchlist(null));
	};

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			const response = await axios.post(routes.optionWatchlist.CreateCustomWatchlist, {
				name,
			});
			const data = response.data;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			try {
				await refetchWatchlistList();
			} catch (e) {
				//
			}

			onCloseModal();
		} catch (e) {
			setLoading(false);
		}
	};

	return (
		<Modal
			transparent
			style={{ modal: { transform: 'translate(-50%, -50%)' } }}
			top='50%'
			onClose={onCloseModal}
			{...props}
		>
			<Div className='bg-white'>
				<h2 className='text-xl font-medium text-gray-1000'>{t('add_new_option_watchlist_modal.title')}</h2>

				<form method='get' onSubmit={onSubmit} className='w-full flex-1 gap-36 flex-column'>
					<label className='w-full items-start gap-8 flex-column'>
						<span className='text-lg font-medium text-gray-900'>
							{t('add_new_option_watchlist_modal.input_label')}
						</span>
						<input
							autoFocus
							type='text'
							maxLength={36}
							value={name}
							placeholder={t('add_new_option_watchlist_modal.input_placeholder')}
							className='h-40 w-full rounded border border-input px-16 text-base'
							onChange={(e) => setName(e.target.value)}
						/>
					</label>

					<div className='w-full gap-8 flex-justify-center'>
						<button
							type='button'
							onClick={onCloseModal}
							className='h-40 flex-1 rounded text-lg btn-disabled-outline'
						>
							{t('common.cancel')}
						</button>

						<Button
							loading={loading}
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
};

export default AddNewOptionWatchlist;
