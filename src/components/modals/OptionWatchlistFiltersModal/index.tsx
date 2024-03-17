import { useAppDispatch } from '@/features/hooks';
import { toggleOptionFiltersModal } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import styled from 'styled-components';
import Modal from '../Modal';
import Form from './Form';

const Div = styled.div`
	width: 560px;
`;

interface OptionWatchlistFiltersModalProps extends IBaseModalConfiguration {}

const OptionWatchlistFiltersModal = (props: OptionWatchlistFiltersModalProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const onCloseModal = () => {
		dispatch(toggleOptionFiltersModal(null));
	};

	return (
		<Modal transparent top='14%' onClose={onCloseModal} {...props}>
			<Div className='gap-40 bg-white flex-column'>
				<Modal.Header label={t('option_watchlist_filters_modal.title')} onClose={onCloseModal} />

				<Form />
			</Div>
		</Modal>
	);
};

export default OptionWatchlistFiltersModal;
