import { XSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { toggleAuthenticationModal } from '@/features/slices/modalSlice';
import styled from 'styled-components';
import Modal from '../Modal';
import PhoneNumberForm from './PhoneNumberForm';

const Div = styled.div`
	width: 578px;
	height: 560px;
`;

const AuthenticationModal = () => {
	const dispatch = useAppDispatch();

	const onCloseModal = () => {
		dispatch(toggleAuthenticationModal(false));
	};

	return (
		<Modal onClose={onCloseModal}>
			<Div className='bg-white flex flex-col rounded-md p-24'>
				<div className='mr-auto pb-32'>
					<button type='button' className='text-gray-100'>
						<XSVG />
					</button>
				</div>

				<div className='text-center'>
					<h1 className='text-3xl font-bold text-gray-100'>ورود به کهکشان</h1>
				</div>

				<PhoneNumberForm />
			</Div>
		</Modal>
	);
};

export default AuthenticationModal;
