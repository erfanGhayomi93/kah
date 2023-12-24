import { XSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { toggleAuthenticationModal } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import styled from 'styled-components';
import Modal from '../Modal';
import OTPForm from './OTPForm';
import PhoneNumberForm from './PhoneNumberForm';
import Welcome from './Welcome';

const Div = styled.div`
	width: 578px;
	height: 560px;
`;

const AuthenticationModal = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const [stage, setStage] = useState<'phoneNumber' | 'otp' | 'welcome'>('phoneNumber');

	const onCloseModal = () => {
		dispatch(toggleAuthenticationModal(false));
	};

	return (
		<Modal onClose={onCloseModal}>
			<Div className='flex flex-col rounded-md bg-white p-24'>
				{stage !== 'welcome' && (
					<>
						<div className='absolute left-24 z-10'>
							<button onClick={onCloseModal} type='button' className='text-gray-100'>
								<XSVG />
							</button>
						</div>

						<div style={{ height: '8.8rem' }} className='relative mt-48 text-center'>
							<h1 className='text-3xl font-bold text-gray-100'>{t('authentication_modal.login_to_kahkeshan')}</h1>
						</div>
					</>
				)}

				{stage === 'welcome' && <Welcome />}
				{stage === 'phoneNumber' && <PhoneNumberForm submit={() => setStage('otp')} />}
				{stage === 'otp' && <OTPForm submit={() => setStage('welcome')} />}
			</Div>
		</Modal>
	);
};

export default AuthenticationModal;
