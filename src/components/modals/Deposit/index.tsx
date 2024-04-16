import { useAppDispatch } from '@/features/hooks';
import { setDepositModal } from '@/features/slices/modalSlice';
import { type IDepositModal } from '@/features/slices/modalSlice.interfaces';
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

interface DepositProps extends IDepositModal {}

const Deposit = forwardRef<HTMLDivElement, DepositProps>((props, ref) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const onCloseModal = () => {
		dispatch(setDepositModal(null));
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
				<Header label={t('deposit_modal.title')} onClose={onCloseModal} />
			</Div>
		</Modal>
	);
});

export default Deposit;
