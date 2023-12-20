import Button from '@/components/common/Button';
import Countdown from '@/components/common/Countdown';
import clsx from 'clsx';
import { useState } from 'react';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';

interface Inputs {
	otp: string;
	captcha: string;
}

const OTPForm = () => {
	const {
		control,
		formState: { isValid },
		handleSubmit,
	} = useForm<Inputs>({ mode: 'onChange' });

	const [finished, setFinished] = useState(false);

	const onSubmit: SubmitHandler<Inputs> = async ({ otp, captcha }) => {
		console.log(otp, captcha);
	};

	const onFinishedCountdown = () => {
		setFinished(true);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} method='get' className='flex flex-col gap-88 px-64 pt-96'>
			<Controller
				defaultValue=''
				control={control}
				name='otp'
				rules={{
					validate: (value) => {
						if (value.length === 4 || value.length === 6) return undefined;
						return 'کد تایید نادرست است!';
					},
				}}
				render={({ field, fieldState: { invalid, isTouched, error } }) => (
					<label className='flex flex-col gap-8'>
						<span className='text-base font-medium text-gray-100'>کد تایید</span>
						<div className='relative flex flex-col'>
							<div
								className={clsx(
									'h-48 rounded border text-right flex-items-center',
									isTouched && invalid ? 'border-error-100' : 'border-gray-300',
								)}
							>
								<input
									autoFocus
									type='text'
									inputMode='numeric'
									maxLength={6}
									className='bg-transparent ltr h-full flex-1 px-16 text-right'
									placeholder='کد ارسال شده به شماره همراه خود را وارد کنید'
									{...field}
								/>
								<div
									className={clsx(
										'font-IRANSansFaNum h-32 w-56 border-r border-r-gray-300 text-center flex-justify-center',
										finished ? 'text-error-100' : 'text-primary-200',
									)}
								>
									<Countdown onFinished={onFinishedCountdown} seconds={3} />
								</div>
							</div>
							{finished ? (
								<div className='flex'>
									<span className='validation-message error'>زمان شما به پایان رسید، روی ارسال دوباره کلیک کنید.</span>
									<button type='button' className='validation-message left-0 text-link underline'>
										ارسال مجدد
									</button>
								</div>
							) : (
								isTouched && invalid && <span className='validation-message error'>{error?.message}</span>
							)}
						</div>
					</label>
				)}
			/>

			<Button type='submit' disabled={!isValid} className='btn-primary h-48 gap-4 rounded shadow'>
				ثبت
			</Button>
		</form>
	);
};

export default OTPForm;
