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
		<Modal transparent top='14%' onClose={onClose}>
			<Div className='gap-40 bg-white flex-column'>
				<div className='relative h-56 border-b border-b-gray-500 flex-justify-center'>
					<h2 className='text-xl font-medium'>{t('option_watchlist_filters_modal.title')}</h2>

					<button onClick={onClose} type='button' className='absolute left-24 z-10 text-gray-900'>
						<XSVG width='1.6rem' height='1.6rem' />
					</button>
				</div>

				<Form />
			</Div>
		</Modal>
	);
};

export default OptionWatchlistFiltersModal;
