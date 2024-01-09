import { useAppDispatch } from '@/features/hooks';
import { toggleLoginModal } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import AuthenticationModalTemplate from '../common/AuthenticationModalTemplate';
import OTPForm from './OTPForm';
import PhoneNumberForm from './PhoneNumberForm';
import Welcome from './Welcome';

const LoginModal = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const [loginResult, setLoginResult] = useState<null | OAuthAPI.ILoginFirstStep>(null);

	const [stage, setStage] = useState<'phoneNumber' | 'otp' | 'welcome'>('phoneNumber');

	const onCloseModal = () => {
		dispatch(toggleLoginModal(false));
	};

	return (
		<AuthenticationModalTemplate hideTitle={stage === 'welcome'} title={t('login_modal.title')} onClose={onCloseModal}>
			{stage === 'phoneNumber' && <PhoneNumberForm goToOTP={() => setStage('otp')} setLoginResult={setLoginResult} />}
			{stage === 'otp' && (
				<OTPForm loginResult={loginResult} setLoginResult={setLoginResult} goToWelcome={() => setStage('welcome')} />
			)}
			{stage === 'welcome' && <Welcome />}
		</AuthenticationModalTemplate>
	);
};

export default LoginModal;
