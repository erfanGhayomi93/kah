import Button from '@/components/common/Button';
import Countdown from '@/components/common/Countdown';
import clsx from 'clsx';
import { useState } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import Captcha from './common/Captcha';

interface Inputs {
	otp: string;
	captcha: string;
}

interface OTPFormProps {
	submit: () => void;
}

const OTPForm = ({ submit }: OTPFormProps) => {
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
						return 'کد تایید نادرست است!';
					},
				}}
				render={({ field, fieldState: { invalid, isTouched, error } }) => (
					<label className={clsx('input-box', !((isTouched && invalid) || seconds === -1) && 'pb-8')}>
						<span className='label'>کد تایید</span>
						<div className={clsx('input flex-items-center', isTouched && invalid && 'invalid')}>
							<input
								autoFocus
								type='text'
								inputMode='numeric'
								maxLength={6}
								className='flex-1'
								placeholder='کد ارسال شده به شماره همراه خود را وارد کنید'
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
								<span className='i-error'>زمان شما به پایان رسید، روی ارسال دوباره کلیک کنید.</span>
								<button onClick={onResendOTP} type='button' className='text-tiny text-link underline'>
									ارسال دوباره
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
				ثبت
			</Button>
		</form>
	);
};

export default OTPForm;
