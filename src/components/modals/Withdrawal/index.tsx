import { useAppDispatch } from '@/features/hooks';
import { setWithdrawalModal } from '@/features/slices/modalSlice';
import { type IWithdrawalModal } from '@/features/slices/modalSlice.interfaces';
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

interface WithdrawalProps extends IWithdrawalModal {}

const Withdrawal = forwardRef<HTMLDivElement, WithdrawalProps>((props, ref) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const onCloseModal = () => {
		dispatch(setWithdrawalModal(null));
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
				<Header label={t('withdrawal_modal.title')} onClose={onCloseModal} />
			</Div>
		</Modal>
	);
});

export default Withdrawal;
