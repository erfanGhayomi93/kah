import { XSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { toggleAuthenticationModal } from '@/features/slices/modalSlice';
import styled from 'styled-components';
import Modal from '../Modal';
import OTPForm from './OTPForm';

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

				<div className='relative text-center'>
					<h1 className='text-3xl font-bold text-gray-100'>ورود به کهکشان</h1>
					<p className='absolute left-1/2 top-56 w-full -translate-x-1/2 transform text-center text-base text-primary-300'>
						برای شماره موبایل وارد شده حساب کاربری یافت نشد.
						<br />
						برای ایجاد حساب، کد تایید را وارد کنید.
					</p>
				</div>

				{/* <PhoneNumberForm /> */}
				<OTPForm />
			</Div>
		</Modal>
	);
};

export default AuthenticationModal;
