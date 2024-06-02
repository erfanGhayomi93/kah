import UserProgressBar from '@/components/pages/Dashboard/components/UserProgressBar';
import { useAppDispatch } from '@/features/hooks';
import { setUserProgressBarModal } from '@/features/slices/modalSlice';
import { forwardRef } from 'react';
import styled from 'styled-components';
import Modal from '../../Modal';

const Div = styled.div`
	width: 600px;
	min-height: 400px;
	display: flex;
	flex-direction: column;
`;

interface IUserProgressBarModalProps extends IBaseModalConfiguration {}

const UserProgressBarModal = forwardRef<HTMLDivElement, IUserProgressBarModalProps>((props, ref) => {
	const dispatch = useAppDispatch();

	const onclose = () => {
		dispatch(setUserProgressBarModal(null));
	};

	return (
		<Modal
			onClose={onclose}
			style={{ modal: { transform: 'translate(-50%, -50%)' } }}
			top='50%'
			{...props}
			ref={ref}
		>
			<Div className='bg-white'>
				<UserProgressBar isModal />
			</Div>
		</Modal>
	);
});

export default UserProgressBarModal;
