import { useAppDispatch } from '@/features/hooks';
import { toggleAuthenticationModal } from '@/features/slices/modalSlice';
import styled from 'styled-components';
import Modal from '../Modal';
import Welcome from './Welcome';

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
			<Div className='flex flex-col rounded-md bg-white p-24'>
				{/* <div className='absolute left-24 z-10'>
					<button type='button' className='text-gray-100'>
						<XSVG />
					</button>
				</div>

				<div style={{ height: '8.8rem' }} className='relative mt-48 text-center'>
					<h1 className='text-3xl font-bold text-gray-100'>ورود به کهکشان</h1>
				</div> */}

				<Welcome />
				{/* <PhoneNumberForm /> */}
				{/* <OTPForm /> */}
			</Div>
		</Modal>
	);
};

export default AuthenticationModal;
