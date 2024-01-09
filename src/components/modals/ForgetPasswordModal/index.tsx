import { useAppDispatch } from '@/features/hooks';
import { toggleForgetPasswordModal } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import AuthenticationModalTemplate from '../common/AuthenticationModalTemplate';
import OTPForm from './OTPForm';
import PhoneNumberForm from './PhoneNumberForm';

const ForgetPasswordModal = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const [result, setResult] = useState<null | OAuthAPI.IForgetPasswordFirstStep>(null);

	const [stage, setStage] = useState<'phoneNumber' | 'otp' | 'change-password'>('phoneNumber');

	const onCloseModal = () => {
		dispatch(toggleForgetPasswordModal(false));
	};

	return (
		<AuthenticationModalTemplate title={t('forget_password_modal.title')} onClose={onCloseModal}>
			{stage === 'phoneNumber' && <PhoneNumberForm setResult={setResult} goToOTP={() => setStage('otp')} />}
			{stage === 'otp' && <OTPForm result={result} setResult={setResult} goToChangePassword={() => setStage('change-password')} />}
		</AuthenticationModalTemplate>
	);
};

export default ForgetPasswordModal;
