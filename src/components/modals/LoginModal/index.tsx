import axios from '@/api/axios';
import routes from '@/api/routes';
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

	const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

	const [stage, setStage] = useState<'phoneNumber' | 'otp' | 'welcome'>('phoneNumber');

	const onCloseModal = () => {
		dispatch(toggleLoginModal(false));
	};

	const onChangePhoneNumber = () => {
		setStage('phoneNumber');
		setLoginResult(null);
	};

	const sendOTP = (pNumber?: string) => {
		return new Promise<void>(async (resolve, reject) => {
			try {
				const response = await axios.post<ServerResponse<OAuthAPI.ILoginFirstStep>>(
					routes.authentication.LoginFirstStep,
					{
						mobileNumber: pNumber ?? phoneNumber,
					},
				);
				const { data } = response;
				const { state } = data.result;

				if (response.status !== 200 || !data.succeeded || state === 'Fail')
					throw new Error(data.errors?.[0] ?? 'TooManyRequest');

				if (['NewUser', 'OTP'].includes(state)) {
					setLoginResult(data.result);
					setStage('otp');
					resolve();

					if (pNumber) setPhoneNumber(pNumber);
				} else throw new Error('TooManyRequest');
			} catch (e) {
				reject((e as Error).message);
			}
		});
	};

	const isLoggedIn = !loginResult || loginResult.state === 'NewUser' || loginResult.state === 'OTP';

	return (
		<AuthenticationModalTemplate
			hideTitle={stage === 'welcome'}
			title={t(isLoggedIn ? 'login_modal.login_title' : 'login_modal.register_title')}
			onClose={onCloseModal}
			description={isLoggedIn ? undefined : t('login_modal.user_not_found')}
		>
			{stage === 'phoneNumber' && <PhoneNumberForm sendOTP={sendOTP} setLoginResult={setLoginResult} />}
			{stage === 'otp' && (
				<OTPForm
					loginResult={loginResult}
					goToWelcome={() => setStage('welcome')}
					goToPhoneNumber={onChangePhoneNumber}
					resendOTP={sendOTP}
				/>
			)}
			{stage === 'welcome' && <Welcome isLoggedIn={isLoggedIn} loginResult={loginResult} />}
		</AuthenticationModalTemplate>
	);
};

export default LoginModal;
