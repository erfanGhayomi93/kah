import { useAppDispatch } from '@/features/hooks';
import { setOptionFiltersModal } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import { forwardRef } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';
import Form from './Form';

const Div = styled.div`
	width: 560px;
`;

interface OptionWatchlistFiltersModalProps extends IBaseModalConfiguration {}

const OptionWatchlistFiltersModal = forwardRef<HTMLDivElement, OptionWatchlistFiltersModalProps>((props, ref) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const onCloseModal = () => {
		dispatch(setOptionFiltersModal(null));
	};

	return (
		<Modal transparent top='14%' onClose={onCloseModal} {...props} ref={ref}>
			<Div className='gap-40 bg-white flex-column'>
				<Header label={t('option_watchlist_filters_modal.title')} onClose={onCloseModal} />
				<Form />
			</Div>
		</Modal>
	);
});

export default OptionWatchlistFiltersModal;
