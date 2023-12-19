import { ArrowLeftSVG, XSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { toggleAuthenticationModal } from '@/features/slices/modalSlice';
import { convertStringToNumber } from '@/utils/helpers';
import { useState } from 'react';
import styled from 'styled-components';
import Modal from '../Modal';

const Div = styled.div`
	width: 578px;
	height: 560px;
`;

const AuthenticationModal = () => {
	const [phoneNumber, setPhoneNumber] = useState('');

	const dispatch = useAppDispatch();

	const onCloseModal = () => {
		dispatch(toggleAuthenticationModal(false));
	};

	const onChangeInput = (value: string) => {
		if (value.length > 12) return;
		setPhoneNumber(value);
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

				<form method='get' className='flex flex-col gap-88 px-64 pt-96'>
					<label className='relative flex flex-col gap-8'>
						<span className='text-base font-medium text-gray-100'>شماره همراه</span>
						<input
							type='text'
							inputMode='numeric'
							className='bg-transparent ltr h-48 rounded border border-gray-300 px-16 text-right'
							placeholder='شماره همراه خود را وارد کنید'
							value={phoneNumber}
							onChange={(e) => onChangeInput(convertStringToNumber(e.target.value))}
						/>
					</label>

					<button type='submit' className='btn-primary h-48 gap-4 rounded shadow'>
						ادامه
						<ArrowLeftSVG />
					</button>
				</form>
			</Div>
		</Modal>
	);
};

export default AuthenticationModal;
