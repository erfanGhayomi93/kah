import axios from '@/api/axios';
import routes from '@/api/routes';
import Button from '@/components/common/Button';
import Captcha from '@/components/common/Inputs/Captcha';
import { EyeSVG, EyeSlashSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { toggleForgetPasswordModal, toggleLoginModal } from '@/features/slices/modalSlice';
import { setCookie } from '@/utils/cookie';
import { base64encode } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';

interface Inputs {
	password: string;
	captcha: string;
}

interface PasswordFormProps {
	loginResult: null | OAuthAPI.ILoginFirstStep;
	setLoginResult: (value: OAuthAPI.ILoginFirstStep) => void;
	goToWelcome: () => void;
	goToLoginWithOTP: () => void;
}

const PasswordForm = ({ loginResult, setLoginResult, goToWelcome, goToLoginWithOTP }: PasswordFormProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const {
		control,
		formState: { isValid, errors, isSubmitting, touchedFields },
		handleSubmit,
		setError,
	} = useForm<Inputs>({ mode: 'onChange' });

	const [seconds, setSeconds] = useState<number | null>(loginResult?.otpRemainSecond ?? -1);

	const [passwordIsVisible, setPasswordIsVisible] = useState(false);

	const onSubmit: SubmitHandler<Inputs> = async ({ password, captcha }) => {
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

			setCookie('client_id', data.result.token);
			goToWelcome();
		} catch (e) {
			setError('password', {
				message: t('i_errors.invalid_password'),
				type: 'value',
			});
		}
	};

	const loginWithOTP = async () => {
		if (!loginResult) return;

		try {
			const response = await axios.post<ServerResponse<OAuthAPI.ISendPasslessOTP>>(
				routes.authentication.SendPasslessOTP,
				{
					token: loginResult.nextStepToken,
				},
			);
			const { data } = response;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			setLoginResult(data.result);
			goToLoginWithOTP();
		} catch (e) {
			setError('password', {
				message: t('i_errors.undefined_error'),
				type: 'value',
			});
		}
	};

	const forgetPassword = () => {
		dispatch(toggleLoginModal(false));
		dispatch(toggleForgetPasswordModal(true));
	};

	useEffect(() => {
		if (!loginResult) return;
		setSeconds(loginResult?.otpRemainSecond ?? -1);
	}, [loginResult]);

	const hasCaptcha = false;

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			method='get'
			className={clsx('flex flex-1 flex-col gap-24 px-64', !hasCaptcha && 'pt-48')}
		>
			<Controller
				defaultValue=''
				control={control}
				name='password'
				render={({ field, fieldState: { invalid, isTouched, error } }) => (
					<label className={clsx('input-box')}>
						<span className='label'>{t('inputs.password')}</span>
						<div className={clsx('flex-items-center input')}>
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
								className='border-r-0 prefix'
							>
								{passwordIsVisible ? <EyeSlashSVG /> : <EyeSVG />}
							</button>
						</div>

						<div className='flex justify-between'>
							{isTouched && invalid && <span className='i-error'>{error?.message}</span>}
							<button onClick={forgetPassword} type='button' className='mr-auto text-base text-link'>
								{t('login_modal.forget_password')}
							</button>
						</div>
					</label>
				)}
			/>

			{hasCaptcha && <Captcha control={control} />}

			<div
				style={{
					bottom:
						hasCaptcha &&
						(touchedFields.password ?? seconds === -1) &&
						touchedFields.captcha &&
						(errors.password ?? seconds === -1) &&
						errors.captcha
							? '5.6rem'
							: '8rem',
					width: 'calc(100% - 17.6rem)',
				}}
				className='!absolute flex flex-col gap-8 pt-24'
			>
				<Button
					type='submit'
					loading={isSubmitting}
					disabled={!isValid}
					className='h-48 rounded shadow btn-primary'
				>
					{t('login_modal.login')}
				</Button>

				<button type='button' onClick={loginWithOTP} className='h-48 font-medium text-primary-300'>
					{t('login_modal.login_with_otp')}
				</button>
			</div>
		</form>
	);
};

export default PasswordForm;
