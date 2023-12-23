import Button from '@/components/common/Button';
import { ArrowLeftSVG } from '@/components/icons';
import clsx from 'clsx';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import Captcha from './common/Captcha';

interface Inputs {
	phoneNumber: string;
	captcha: string;
}

interface PhoneNumberFormProps {
	submit: () => void;
}

const PhoneNumberForm = ({ submit }: PhoneNumberFormProps) => {
	const {
		control,
		formState: { isValid, touchedFields, errors },
		handleSubmit,
	} = useForm<Inputs>({ mode: 'onChange' });

	const onSubmit: SubmitHandler<Inputs> = async ({ phoneNumber, captcha }) => {
		submit();
	};

	const hasCaptcha = true;

	return (
		<form onSubmit={handleSubmit(onSubmit)} method='get' className={clsx('flex flex-1 flex-col gap-24 px-64', !hasCaptcha && 'pt-48')}>
			<Controller
				defaultValue=''
				control={control}
				name='phoneNumber'
				rules={{
					validate: (value) => {
						if (value.length === 12 && /^989\d{9}$/.test(value)) return undefined;
						if (value.length === 11 && /^09\d{9}$/.test(value)) return undefined;
						return 'شماره همراه نادرست است!';
					},
				}}
				render={({ field, fieldState: { invalid, isTouched, error } }) => (
					<label className={clsx('input-box', !(isTouched && invalid) && 'pb-8')}>
						<span className='label'>شماره همراه</span>
						<input
							autoFocus
							type='text'
							inputMode='numeric'
							maxLength={12}
							className={clsx('input', isTouched && invalid && 'invalid')}
							placeholder='شماره همراه خود را وارد کنید'
							{...field}
						/>
						{isTouched && invalid && <span className='i-error'>{error?.message}</span>}
					</label>
				)}
			/>

			{hasCaptcha && <Captcha control={control} />}

			<Button
				style={{
					bottom: hasCaptcha && Object.keys(touchedFields).length > 1 && Object.keys(errors).length > 1 ? '5.6rem' : '11.6rem',
					width: 'calc(100% - 17.6rem)',
				}}
				type='submit'
				disabled={!isValid}
				className='!absolute h-48 gap-4 rounded shadow btn-primary'
			>
				ادامه
				<ArrowLeftSVG />
			</Button>
		</form>
	);
};

export default PhoneNumberForm;
