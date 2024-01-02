import Button from '@/components/common/Button';
import Countdown from '@/components/common/Countdown';
import Captcha from '@/components/common/Inputs/Captcha';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';

interface Inputs {
	otp: string;
	captcha: string;
}

interface OTPFormProps {
	submit: () => void;
}

const OTPForm = ({ submit }: OTPFormProps) => {
	const t = useTranslations();

	const {
		control,
		formState: { isValid, errors, touchedFields },
		handleSubmit,
	} = useForm<Inputs>({ mode: 'onChange' });

	const [seconds, setSeconds] = useState<number | null>(10);

	const onSubmit: SubmitHandler<Inputs> = async ({ otp, captcha }) => {
		submit();
	};

	const onFinishedCountdown = () => {
		setSeconds(-1);
	};

	const onResendOTP = () => {
		setSeconds(null);
		setTimeout(() => setSeconds(10), 2000);
	};

	const hasCaptcha = true;

	return (
		<form onSubmit={handleSubmit(onSubmit)} method='get' className={clsx('flex flex-1 flex-col gap-24 px-64', !hasCaptcha && 'pt-48')}>
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
								{seconds ? (
									<Countdown onFinished={onFinishedCountdown} seconds={seconds} />
								) : (
									<div className='spinner h-24 w-24' />
								)}
							</div>
						</div>
						{seconds === -1 ? (
							<div className='flex justify-between'>
								<span className='i-error'>{t('authentication_modal.resend_otp_description')}</span>
								<button onClick={onResendOTP} type='button' className='text-tiny text-link underline'>
									{t('authentication_modal.resend_otp')}
								</button>
							</div>
						) : (
							isTouched && invalid && <span className='i-error'>{error?.message}</span>
						)}
					</label>
				)}
			/>

			{hasCaptcha && <Captcha control={control} />}

			<Button
				style={{
					bottom:
						hasCaptcha &&
						(touchedFields.otp ?? seconds === -1) &&
						touchedFields.captcha &&
						(errors.otp ?? seconds === -1) &&
						errors.captcha
							? '5.6rem'
							: '11.6rem',
					width: 'calc(100% - 17.6rem)',
				}}
				type='submit'
				disabled={!isValid}
				className='!absolute h-48 gap-4 rounded shadow btn-primary'
			>
				{t('common.register')}
			</Button>
		</form>
	);
};

export default OTPForm;
