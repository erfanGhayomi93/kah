import axios from '@/api/axios';
import routes from '@/api/routes';
import Button from '@/components/common/Button';
import Countdown from '@/components/common/Countdown';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';

interface Inputs {
	otp: string;
}

interface OTPFormProps {
	result: null | OAuthAPI.IForgetPasswordFirstStep;
	setResult: (value: OAuthAPI.IValidateForgetPasswordOtp) => void;
	goToChangePassword: () => void;
}

const OTPForm = ({ result, setResult, goToChangePassword }: OTPFormProps) => {
	const t = useTranslations();

	const {
		control,
		formState: { isValid, errors, isSubmitting, touchedFields },
		handleSubmit,
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
	};

	const onResendOTP = () => {
		setSeconds(null);
		setTimeout(() => setSeconds(10), 2000);
	};

	useEffect(() => {
		if (!result) return;
		setSeconds(result.otpRemainSecond);
	}, [result]);

	return (
		<form onSubmit={handleSubmit(onSubmit)} method='get' className='flex-1 justify-between px-64 flex-column'>
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
										typeof seconds === 'number' && seconds <= 0
											? 'text-error-100'
											: 'text-primary-200',
									)}
								>
									{seconds ? (
										<Countdown onFinished={onFinishedCountdown} seconds={seconds} />
									) : (
										<div className='spinner size-24' />
									)}
								</div>
							</div>
							{seconds === -1 ? (
								<div className='flex justify-between'>
									<span className='i-error'>{t('login_modal.resend_otp_description')}</span>
									<button onClick={onResendOTP} type='button' className='text-base text-link'>
										{t('login_modal.resend_otp')}
									</button>
								</div>
							) : (
								isTouched && invalid && <span className='i-error'>{error?.message}</span>
							)}
						</label>
					)}
				/>
			</div>

			<Button
				style={{
					bottom: '6.4rem',
					width: 'calc(100% - 17.6rem)',
				}}
				type='submit'
				loading={isSubmitting}
				disabled={!isValid}
				className='!absolute h-48 gap-4 rounded shadow btn-primary'
			>
				{t('common.register')}
			</Button>
		</form>
	);
};

export default OTPForm;
