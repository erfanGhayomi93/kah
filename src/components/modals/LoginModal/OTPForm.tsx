import axios from '@/api/axios';
import routes from '@/api/routes';
import Button from '@/components/common/Button';
import Countdown from '@/components/common/Countdown';
import { setClientId } from '@/utils/cookie';
import { cn, convertStringToInteger } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';

interface Inputs {
	otp: string;
}

interface OTPFormProps {
	loginResult: null | OAuthAPI.ILoginFirstStep;
	phoneNumber: string;
	onLoggedIn: () => void;
	clearToast: () => void;
	setLoginResult: (value: OAuthAPI.ILoginFirstStep) => void;
	goToWelcome: () => void;
	goToPhoneNumber: (alertMessage?: string) => void;
}

const OTPForm = ({
	loginResult,
	phoneNumber,
	clearToast,
	onLoggedIn,
	setLoginResult,
	goToWelcome,
	goToPhoneNumber,
}: OTPFormProps) => {
	const t = useTranslations();

	const isFirstFetched = useRef<boolean>(false);

	const {
		control,
		formState: { isValid, isSubmitting },
		handleSubmit,
		setError,
		clearErrors,
	} = useForm<Inputs>({ mode: 'onChange' });

	const [seconds, setSeconds] = useState<number | null>(loginResult?.otpRemainSecond ?? -1);

	const [resendOtpToken] = useState<string | null>(loginResult?.nextStepToken ?? null);

	const onSubmit: SubmitHandler<Inputs> = async ({ otp }) => {
		if (!loginResult) return;

		try {
			clearToast();

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

			setClientId(data.result.token);

			onLoggedIn();
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

			if (data.result.state === 'Fail') goToPhoneNumber('i_errors.invalid_token');

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

		setSeconds(loginResult?.otpRemainSecond || null);
	}, [loginResult]);

	useEffect(() => {
		if (isFirstFetched.current) return;

		if (!loginResult || loginResult.state === 'HasPassword' || !seconds || seconds < 1) resendOTP();
		isFirstFetched.current = true;
	}, []);

	return (
		<form onSubmit={handleSubmit(onSubmit)} method='get' className='flex-1 justify-between px-64 pb-64 flex-column'>
			<div style={{ marginTop: '12rem' }} className='gap-24 flex-column'>
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
						<label className={cn('input-box', !((isTouched && invalid) || seconds === -1) && 'pb-8')}>
							<span className='label'>{t('inputs.otp_mobile_number', { mobile: phoneNumber })}</span>

							<div className={cn('flex-items-center input', isTouched && invalid && 'invalid')}>
								<input
									autoFocus
									title={t('inputs.otp_placeholder')}
									type='text'
									inputMode='numeric'
									maxLength={6}
									pattern='\d{4,6}'
									className='flex-1'
									placeholder={t('inputs.otp_placeholder')}
									autoComplete='off'
									{...field}
									onChange={(e) => field.onChange(convertStringToInteger(e.target.value))}
								/>
								<div
									className={cn(
										'prefix',
										typeof seconds === 'number' && seconds <= 0
											? 'text-error-100'
											: 'text-gray-800',
									)}
								>
									{seconds !== null ? (
										<Countdown onFinished={onFinishedCountdown} seconds={seconds} />
									) : (
										<div className='size-24 spinner' />
									)}
								</div>
							</div>

							<div className='flex justify-between'>
								{seconds !== null && seconds > -1 && isTouched && invalid && (
									<span className='i-error'>{error?.message}</span>
								)}

								{seconds === -1 && (
									<button onClick={resendOTP} type='button' className='text-primary-100 text-base'>
										{t('login_modal.resend_otp')}
									</button>
								)}

								<button
									onClick={() => goToPhoneNumber()}
									type='button'
									className='text-primary-100 mr-auto text-base'
								>
									{t('login_modal.change_phone_number')}
								</button>
							</div>
						</label>
					)}
				/>
			</div>

			<Button
				type='submit'
				loading={isSubmitting}
				disabled={!isValid}
				className='h-48 rounded text-lg shadow btn-primary'
			>
				{t('login_modal.login')}
			</Button>
		</form>
	);
};

export default OTPForm;
