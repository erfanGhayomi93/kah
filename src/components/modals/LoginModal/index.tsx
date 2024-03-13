import axios from '@/api/axios';
import routes from '@/api/routes';
import Loading from '@/components/common/Loading';
import { useAppDispatch } from '@/features/hooks';
import { toggleLoginModal } from '@/features/slices/modalSlice';
import { setIsLoggedIn } from '@/features/slices/userSlice';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import AuthenticationModalTemplate from '../common/AuthenticationModalTemplate';
import OTPForm from './OTPForm';
import Welcome from './Welcome';

const SetPasswordForm = dynamic(() => import('./SetPasswordForm'), {
	ssr: false,
	loading: () => <Loading />,
});

const PasswordForm = dynamic(() => import('./PasswordForm'), {
	ssr: false,
	loading: () => <Loading />,
});

const PhoneNumberForm = dynamic(() => import('./PhoneNumberForm'), {
	ssr: false,
	loading: () => <Loading />,
});

interface LoginModalProps extends IBaseModalConfiguration {}

const LoginModal = (props: LoginModalProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const [loginResult, setLoginResult] = useState<null | OAuthAPI.ILoginFirstStep>(null);

	const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

	const [stage, setStage] = useState<TLoginModalStates>('phoneNumber');

	const [, setToast] = useState<{ type: TLoginModalStates | null; message: string }>({
		type: null,
		message: '',
	});

	const onCloseModal = () => {
		dispatch(toggleLoginModal(null));
	};

	const onLoggedIn = () => {
		dispatch(setIsLoggedIn(true));
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

	const goToPhoneNumber = (alertMessage?: string) => {
		setStage('phoneNumber');
		setLoginResult(null);

		if (alertMessage) {
			setToast({
				type: 'phoneNumber',
				message: alertMessage,
			});
		}
	};

	const clearToast = () => {
		setToast({
			type: null,
			message: '',
		});
	};

	const description = useMemo<string | undefined>(() => {
		if (!loginResult) return undefined;

		const { state } = loginResult;

		if (stage === 'login-with-otp' && state === 'NewUser') return t('login_modal.user_not_found');

		return undefined;
	}, [loginResult, stage]);

	const userState = useMemo(() => {
		if (!loginResult) return 'Fail';
		return loginResult.state;
	}, [loginResult]);

	const hasDescription = typeof description === 'string';

	const isNeedsToSetPassword = ['NewUser', 'OTP'].includes(userState);

	return (
		<AuthenticationModalTemplate
			hideTitle={stage === 'welcome'}
			title={t(stage === 'set-password' ? 'login_modal.set_password_title' : 'login_modal.login_title')}
			onClose={onCloseModal}
			description={description}
			styles={
				stage === 'set-password'
					? {
							description: {
								maxWidth: '36.8rem',
								fontWeight: 700,
							},
						}
					: undefined
			}
			{...props}
		>
			{stage === 'login-with-otp' && (
				<OTPForm
					loginResult={loginResult}
					phoneNumber={phoneNumber ?? '*'}
					setLoginResult={setLoginResult}
					goToWelcome={() => setStage('welcome')}
					goToPhoneNumber={goToPhoneNumber}
					hasDescription={hasDescription}
					clearToast={clearToast}
					onLoggedIn={onLoggedIn}
				/>
			)}

			{stage === 'login-with-password' && (
				<PasswordForm
					loginResult={loginResult}
					phoneNumber={phoneNumber}
					goToWelcome={() => setStage('welcome')}
					goToLoginWithOTP={() => setStage('login-with-otp')}
					onLoggedIn={onLoggedIn}
				/>
			)}

			{stage === 'phoneNumber' && <PhoneNumberForm sendOTP={sendOTP} />}

			{stage === 'welcome' && (
				<Welcome goToSetPassword={() => setStage('set-password')} isNeedsToSetPassword={isNeedsToSetPassword} />
			)}

			{stage === 'set-password' && <SetPasswordForm phoneNumber={phoneNumber ?? '*'} />}
		</AuthenticationModalTemplate>
	);
};

export default LoginModal;
