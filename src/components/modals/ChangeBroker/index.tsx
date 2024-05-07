import { useAppDispatch } from '@/features/hooks';
import { setChangeBrokerModal } from '@/features/slices/modalSlice';
import { type IChangeBrokerModal } from '@/features/slices/types/modalSlice.interfaces';
import { useTranslations } from 'next-intl';
import { forwardRef } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';

const Div = styled.div`
	width: 496px;
	height: 600px;
	display: flex;
	flex-direction: column;
`;

interface ChangeBrokerProps extends IChangeBrokerModal {}

const ChangeBroker = forwardRef<HTMLDivElement, ChangeBrokerProps>((props, ref) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const onCloseModal = () => {
		dispatch(setChangeBrokerModal(null));
	};

	return (
		<Modal
			top='50%'
			style={{ modal: { transform: 'translate(-50%, -50%)' } }}
			ref={ref}
			onClose={onCloseModal}
			{...props}
		>
			<Div className='bg-white flex-column'>
				<Header label={t('change_broker_modal.title')} onClose={onCloseModal} />
			</Div>
		</Modal>
	);
});

export default ChangeBroker;
