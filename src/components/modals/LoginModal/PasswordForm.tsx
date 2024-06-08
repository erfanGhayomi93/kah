import axios from '@/api/axios';
import routes from '@/api/routes';
import Button from '@/components/common/Button';
import { EyeSVG, EyeSlashSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setForgetPasswordModal, setLoginModal } from '@/features/slices/modalSlice';
import { setClientId } from '@/utils/cookie';
import { base64encode, cn } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';

interface Inputs {
	password: string;
}

interface PasswordFormProps {
	phoneNumber: string | null;
	loginResult: null | OAuthAPI.ILoginFirstStep;
	onLoggedIn: () => void;
	goToWelcome: () => void;
	goToLoginWithOTP: () => void;
}

const PasswordForm = ({ loginResult, phoneNumber, onLoggedIn, goToWelcome, goToLoginWithOTP }: PasswordFormProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const {
		control,
		formState: { isValid, isSubmitting },
		handleSubmit,
		setError,
	} = useForm<Inputs>({ mode: 'onChange' });

	const [, setSeconds] = useState<number | null>(loginResult?.otpRemainSecond ?? -1);

	const [passwordIsVisible, setPasswordIsVisible] = useState(false);

	const onSubmit: SubmitHandler<Inputs> = async ({ password }) => {
		if (!loginResult) return;

		try {
			const response = await axios.post<ServerResponse<OAuthAPI.IPasswordLogin>>(
				loginResult.state === 'OTP' ? routes.authentication.OtpLogin : routes.authentication.PasswordLogin,
				{
					hasPassToken: loginResult.nextStepToken,
					password: base64encode(password),
				},
			);
			const { data } = response;

			if (response.status !== 200 || !data.succeeded || !data.result.token)
				throw new Error(data.errors?.[0] ?? '');

			if (data.result.message !== 'Successful') throw new Error();

			setClientId(data.result.token);

			onLoggedIn();
			goToWelcome();
		} catch (e) {
			setError('password', {
				message: t('i_errors.invalid_password'),
				type: 'value',
			});
		}
	};

	const forgetPassword = () => {
		const mParams: { phoneNumber?: string } & IBaseModalConfiguration = { animation: false };
		if (phoneNumber) mParams.phoneNumber = phoneNumber;

		dispatch(setLoginModal(null));
		dispatch(setForgetPasswordModal(mParams));
	};

	useEffect(() => {
		if (!loginResult) return;
		setSeconds(loginResult?.otpRemainSecond ?? -1);
	}, [loginResult]);

	return (
		<form onSubmit={handleSubmit(onSubmit)} method='get' className='flex-1 justify-between px-64 pb-16 flex-column'>
			<input type='hidden' name='username' value={phoneNumber ?? ''} />

			<div style={{ marginTop: '12rem' }} className='gap-24 flex-column'>
				<Controller
					defaultValue=''
					control={control}
					name='password'
					render={({ field, fieldState: { invalid, isTouched, error } }) => (
						<label className={cn('input-box')}>
							<span className='label'>{t('inputs.password')}</span>
							<div className={cn('flex-items-center input')}>
								<input
									title={t('inputs.password')}
									autoFocus
									type={passwordIsVisible ? 'text' : 'password'}
									inputMode='numeric'
									maxLength={72}
									className='flex-1 text-right ltr'
									placeholder={t('inputs.password_placeholder')}
									{...field}
								/>

								<button
									onClick={() => setPasswordIsVisible(!passwordIsVisible)}
									type='button'
									className='border-r-0 text-gray-900 prefix'
								>
									{passwordIsVisible ? <EyeSlashSVG /> : <EyeSVG />}
								</button>
							</div>

							<div className='flex justify-between'>
								{isTouched && invalid && <span className='i-error'>{error?.message}</span>}
								<button
									onClick={forgetPassword}
									type='button'
									className='mr-auto text-base text-primary-400'
								>
									{t('login_modal.forget_password')}
								</button>
							</div>
						</label>
					)}
				/>
			</div>

			<div className='gap-8 flex-column'>
				<Button
					type='submit'
					loading={isSubmitting}
					disabled={!isValid}
					className='h-48 rounded text-lg shadow btn-primary'
				>
					{t('login_modal.login')}
				</Button>

				<button type='button' onClick={goToLoginWithOTP} className='h-40 font-medium text-primary-400'>
					{t('login_modal.login_with_otp')}
				</button>
			</div>
		</form>
	);
};

export default PasswordForm;
