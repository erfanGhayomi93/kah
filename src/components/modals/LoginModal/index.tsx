import axios from '@/api/axios';
import routes from '@/api/routes';
import { useAppDispatch } from '@/features/hooks';
import { toggleLoginModal } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import AuthenticationModalTemplate from '../common/AuthenticationModalTemplate';
import OTPForm from './OTPForm';
import PasswordForm from './PasswordForm';
import PhoneNumberForm from './PhoneNumberForm';
import SetPasswordForm from './SetPasswordForm';
import Welcome from './Welcome';

const LoginModal = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const [loginResult, setLoginResult] = useState<null | OAuthAPI.ILoginFirstStep>(null);

	const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

	const [stage, setStage] = useState<TLoginModalStates>('phoneNumber');

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

				if (['NewUser', 'OTP', 'HasPassword'].includes(state)) {
					setLoginResult(data.result);
					setStage(state === 'HasPassword' ? 'login-with-password' : 'login-with-otp');
					resolve();

					if (pNumber) setPhoneNumber(pNumber);
				} else throw new Error('TooManyRequest');
			} catch (e) {
				reject((e as Error).message);
			}
		});
	};

	const description = useMemo<string | undefined>(() => {
		if (!loginResult) return undefined;

		const { state } = loginResult;

		if (stage === 'set-password') return t('login_modal.set_password_security_description');

		if (stage === 'login-with-otp' && state === 'NewUser') return t('login_modal.user_not_found');

		return undefined;
	}, [loginResult, stage]);

	const userState = useMemo(() => {
		if (!loginResult) return 'Fail';
		return loginResult.state;
	}, [loginResult]);

	const isNeedsToSetPassword = ['NewUser', 'OTP'].includes(userState);

	return (
		<AuthenticationModalTemplate
			hideTitle={stage === 'welcome'}
			title={t(
				stage === 'set-password'
					? 'login_modal.set_password_title'
					: userState === 'NewUser'
						? 'login_modal.register_title'
						: 'login_modal.login_title',
			)}
			onClose={onCloseModal}
			description={description}
			styles={{
				description: {
					maxWidth: '36.8rem',
					fontWeight: 700,
				},
			}}
		>
			{stage === 'login-with-otp' && (
				<OTPForm
					loginResult={loginResult}
					setLoginResult={setLoginResult}
					goToWelcome={() => setStage('welcome')}
					goToPhoneNumber={onChangePhoneNumber}
				/>
			)}

			{stage === 'login-with-password' && (
				<PasswordForm
					loginResult={loginResult}
					goToWelcome={() => setStage('welcome')}
					goToLoginWithOTP={() => setStage('login-with-otp')}
					setLoginResult={setLoginResult}
				/>
			)}

			{stage === 'phoneNumber' && <PhoneNumberForm sendOTP={sendOTP} />}

			{stage === 'welcome' && (
				<Welcome goToSetPassword={() => setStage('set-password')} isNeedsToSetPassword={isNeedsToSetPassword} />
			)}

			{stage === 'set-password' && <SetPasswordForm />}
		</AuthenticationModalTemplate>
	);
};

export default LoginModal;
