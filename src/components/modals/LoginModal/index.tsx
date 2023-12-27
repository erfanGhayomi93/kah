import { useAppDispatch } from '@/features/hooks';
import { toggleLoginModal } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import AuthenticationModalTemplate from '../common/AuthenticationModalTemplate';
import OTPForm from './OTPForm';
import PhoneNumberForm from './PhoneNumberForm';
import Welcome from './Welcome';

const AuthenticationModal = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const [stage, setStage] = useState<'phoneNumber' | 'otp' | 'welcome'>('phoneNumber');

	const onCloseModal = () => {
		dispatch(toggleLoginModal(false));
	};

	return (
		<AuthenticationModalTemplate
			hideTitle={stage === 'welcome'}
			title={t('authentication_modal.login_to_kahkeshan')}
			onClose={onCloseModal}
		>
			{stage === 'welcome' && <Welcome />}
			{stage === 'phoneNumber' && <PhoneNumberForm submit={() => setStage('otp')} />}
			{stage === 'otp' && <OTPForm submit={() => setStage('welcome')} />}
		</AuthenticationModalTemplate>
	);
};

export default AuthenticationModal;
