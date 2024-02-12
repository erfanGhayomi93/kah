import { XSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { toggleOptionFiltersModal } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import styled from 'styled-components';
import Modal from '../Modal';
import Form from './Form';

const Div = styled.div`
	width: 560px;
`;

const OptionWatchlistFiltersModal = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const onClose = () => {
		dispatch(toggleOptionFiltersModal(false));
	};

	return (
		<Modal classes={{ modal: 'rounded-md shadow-section' }} transparent top='14%' onClose={onClose}>
			<Div className='gap-24 bg-white px-24 pb-24 pt-16 flex-column'>
				<div className='flex-justify-center'>
					<h1 className='text-center text-xl font-medium text-gray-1000'>
						{t('option_watchlist_filters_modal.title')}
					</h1>

					<button onClick={onClose} type='button' className='absolute left-24 z-10 text-gray-1000'>
						<XSVG />
					</button>
				</div>

				<Form />
			</Div>
		</Modal>
	);
};

export default OptionWatchlistFiltersModal;
