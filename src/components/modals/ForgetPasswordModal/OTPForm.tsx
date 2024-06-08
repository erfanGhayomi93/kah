import axios from '@/api/axios';
import routes from '@/api/routes';
import Button from '@/components/common/Button';
import Countdown from '@/components/common/Countdown';
import { cn, convertStringToInteger } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';

interface Inputs {
	otp: string;
}

interface OTPFormProps {
	phoneNumber: string;
	result: null | OAuthAPI.IForgetPasswordFirstStep;
	sendOTP: (pNumber?: string) => Promise<OAuthAPI.IForgetPasswordFirstStep>;
	setResult: (value: OAuthAPI.IValidateForgetPasswordOtp) => void;
	goToChangePassword: () => void;
	goToPhoneNumber: () => void;
}

const OTPForm = ({ result, phoneNumber, sendOTP, setResult, goToChangePassword, goToPhoneNumber }: OTPFormProps) => {
	const t = useTranslations();

	const isFirstFetched = useRef<boolean>(false);

	const {
		control,
		formState: { isValid, isSubmitting },
		handleSubmit,
		clearErrors,
		setError,
	} = useForm<Inputs>({ mode: 'onChange' });

	const [seconds, setSeconds] = useState<number | null>(result?.otpRemainSecond ?? null);

	const onSubmit: SubmitHandler<Inputs> = async ({ otp }) => {
		if (!result) return;

		try {
			const response = await axios.post<ServerResponse<OAuthAPI.IValidateForgetPasswordOtp>>(
				routes.authentication.ValidateForgetPasswordOtp,
				{
					otp,
					forgetPasswordToken: result.nextStepToken ?? '',
				},
			);
			const { data } = response;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			setResult(data.result);
			goToChangePassword();
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

	const onResendOTP = () => {
		setSeconds(null);

		sendOTP()
			.then((result) => {
				//
			})
			.catch((e) => {
				setSeconds(-1);
				setError('otp', {
					type: 'value',
					message: t('i_errors.undefined_error'),
				});
			});
	};

	useEffect(() => {
		if (!result) return;

		setSeconds(result?.otpRemainSecond || null);
	}, [result]);

	useEffect(() => {
		if (isFirstFetched.current) return;

		if (!result) {
			onResendOTP();
			isFirstFetched.current = true;
		}
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
											: 'text-gray-1000',
									)}
								>
									{seconds ? (
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
									<button onClick={onResendOTP} type='button' className='text-base text-primary-400'>
										{t('login_modal.resend_otp')}
									</button>
								)}

								<button
									onClick={goToPhoneNumber}
									type='button'
									className='mr-auto text-base text-primary-400'
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
				afterArrow
			>
				{t('common.continue')}
			</Button>
		</form>
	);
};

export default OTPForm;
