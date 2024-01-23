import axios from '@/api/axios';
import routes from '@/api/routes';
import Button from '@/components/common/Button';
import Countdown from '@/components/common/Countdown';
import Captcha from '@/components/common/Inputs/Captcha';
import { setCookie } from '@/utils/cookie';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';

interface Inputs {
	otp: string;
	captcha: string;
}

interface OTPFormProps {
	loginResult: null | OAuthAPI.ILoginFirstStep;
	setLoginResult: (value: OAuthAPI.ILoginFirstStep) => void;
	goToWelcome: () => void;
	goToPhoneNumber: () => void;
}

const OTPForm = ({ loginResult, setLoginResult, goToWelcome, goToPhoneNumber }: OTPFormProps) => {
	const t = useTranslations();

	const isFirstFetched = useRef<boolean>(false);

	const {
		control,
		formState: { isValid, errors, isSubmitting, touchedFields },
		handleSubmit,
		setError,
		clearErrors,
	} = useForm<Inputs>({ mode: 'onChange' });

	const [seconds, setSeconds] = useState<number | null>(loginResult?.otpRemainSecond ?? -1);

	const [resendOtpToken] = useState<string | null>(loginResult?.nextStepToken ?? null);

	const onSubmit: SubmitHandler<Inputs> = async ({ otp, captcha }) => {
		if (!loginResult) return;

		try {
			const isLoggedIn = loginResult.state === 'OTP' || loginResult.state === 'HasPassword';
			const response = await axios.post<ServerResponse<OAuthAPI.IOtpLogin>>(
				isLoggedIn ? routes.authentication.OtpLogin : routes.authentication.SignUp,
				{
					otp,
					[isLoggedIn ? 'loginToken' : 'signUpToken']: loginResult.nextStepToken ?? '',
				},
			);
			const { data } = response;

			if (response.status !== 200 || !data.succeeded || !data.result.token)
				throw new Error(data.errors?.[0] ?? '');

			if (data.result.message !== 'Successful') throw new Error();

			setCookie('client_id', data.result.token);
			goToWelcome();
		} catch (e) {
			setError('otp', {
				message: t('i_errors.invalid_otp'),
				type: 'value',
			});
		}
	};

	const onFinishedCountdown = () => {
		setSeconds(-1);
		clearErrors('otp');
	};

	const resendOTP = async () => {
		if (!loginResult) return;

		try {
			clearErrors('otp');
			setSeconds(null);

			const response = await axios.post<ServerResponse<OAuthAPI.ISendPasslessOTP>>(
				routes.authentication.SendPasslessOTP,
				{
					token: resendOtpToken,
				},
			);
			const { data } = response;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			if (!data.result.nextStepToken)
				throw new Error(
					data.result.state === 'TooManyRequest' ? 'i_errors.too_many_request' : 'i_errors.undefined_error',
				);

			setLoginResult(data.result);
		} catch (e) {
			setSeconds(-1);
			setError('otp', {
				type: 'value',
				message: t((e as Error).message),
			});
		}
	};

	useEffect(() => {
		if (!loginResult) return;

		const remainSeconds = loginResult.otpRemainSecond;
		setSeconds(!remainSeconds || remainSeconds < 1 ? -1 : remainSeconds);
	}, [loginResult]);

	useEffect(() => {
		if (isFirstFetched.current) return;

		if (!loginResult || loginResult.state === 'HasPassword' || !seconds || seconds < 1) resendOTP();
		isFirstFetched.current = true;
	}, []);

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
				name='otp'
				rules={{
					validate: (value) => {
						if (!isNaN(Number(value)) && value.length === 6) return undefined;
						return t('i_errors.invalid_otp');
					},
				}}
				render={({ field, fieldState: { invalid, isTouched, error } }) => (
					<label className={clsx('input-box', !((isTouched && invalid) || seconds === -1) && 'pb-8')}>
						<span className='label'>{t('inputs.otp')}</span>
						<div className={clsx('flex-items-center input', isTouched && invalid && 'invalid')}>
							<input
								title={t('inputs.otp_placeholder')}
								type='text'
								inputMode='numeric'
								maxLength={6}
								pattern='\d{4,6}'
								className='flex-1'
								placeholder={t('inputs.otp_placeholder')}
								autoComplete='off'
								{...field}
							/>
							<div
								className={clsx(
									'prefix',
									typeof seconds === 'number' && seconds <= 0 ? 'text-error-100' : 'text-primary-200',
								)}
							>
								{seconds !== null ? (
									<Countdown onFinished={onFinishedCountdown} seconds={seconds} />
								) : (
									<div className='spinner size-24' />
								)}
							</div>
						</div>

						<div className='flex justify-between'>
							{seconds !== null && seconds > -1 && isTouched && invalid && (
								<span className='i-error'>{error?.message}</span>
							)}

							{seconds === -1 && (
								<button onClick={resendOTP} type='button' className='text-base text-link'>
									{t('login_modal.resend_otp')}
								</button>
							)}
							<button onClick={goToPhoneNumber} type='button' className='mr-auto text-base text-link'>
								{t('login_modal.change_phone_number')}
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
						(touchedFields.otp ?? seconds === -1) &&
						touchedFields.captcha &&
						(errors.otp ?? seconds === -1) &&
						errors.captcha
							? '5.6rem'
							: '8rem',
					width: 'calc(100% - 17.6rem)',
				}}
				className='!absolute flex flex-col gap-8 pt-24'
			>
				<Button
					style={{}}
					type='submit'
					loading={isSubmitting}
					disabled={!isValid}
					className='h-48 rounded shadow btn-primary'
				>
					{t('login_modal.login')}
				</Button>
			</div>
		</form>
	);
};

export default OTPForm;
