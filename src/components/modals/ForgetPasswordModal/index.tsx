import { useAppDispatch } from '@/features/hooks';
import { toggleForgetPasswordModal, toggleLoginModal } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import AuthenticationModalTemplate from '../common/AuthenticationModalTemplate';
import ChangePassword from './ChangePassword';
import OTPForm from './OTPForm';
import PhoneNumberForm from './PhoneNumberForm';

const ForgetPasswordModal = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const [result, setResult] = useState<
		null | OAuthAPI.IForgetPasswordFirstStep | OAuthAPI.IValidateForgetPasswordOtp
	>(null);

	const [stage, setStage] = useState<'phoneNumber' | 'otp' | 'change-password'>('phoneNumber');

	const onCloseModal = () => {
		dispatch(toggleForgetPasswordModal(false));
	};

	const goToLogin = () => {
		dispatch(toggleLoginModal(true));
		dispatch(toggleForgetPasswordModal(false));
	};

	return (
		<AuthenticationModalTemplate title={t('forget_password_modal.title')} onClose={onCloseModal}>
			{stage === 'phoneNumber' && <PhoneNumberForm setResult={setResult} goToOTP={() => setStage('otp')} />}
			{stage === 'otp' && (
				<OTPForm
					result={result as OAuthAPI.IForgetPasswordFirstStep}
					setResult={setResult}
					goToChangePassword={() => setStage('change-password')}
				/>
			)}
			{stage === 'change-password' && (
				<ChangePassword result={result as OAuthAPI.IValidateForgetPasswordOtp} goToLogin={goToLogin} />
			)}
		</AuthenticationModalTemplate>
	);
};

export default ForgetPasswordModal;
