import Button from '@/components/common/Button';
import { ArrowLeftSVG } from '@/components/icons';
import clsx from 'clsx';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';

interface Inputs {
	phoneNumber: string;
}

const PhoneNumberForm = () => {
	const {
		control,
		formState: { isValid },
		handleSubmit,
	} = useForm<Inputs>({ mode: 'onChange' });

	const onSubmit: SubmitHandler<Inputs> = async ({ phoneNumber }) => {
		console.log(phoneNumber);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} method='get' className='flex flex-col gap-88 px-64 pt-96'>
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
				render={({ field, fieldState: { invalid, isTouched, isDirty, error } }) => (
					<label className='flex flex-col gap-8'>
						<span className='text-base font-medium text-gray-100'>شماره همراه</span>
						<div className='relative flex flex-col'>
							<input
								autoFocus
								type='text'
								inputMode='numeric'
								maxLength={12}
								className={clsx(
									'bg-transparent ltr h-48 rounded border px-16 text-right',
									isTouched && invalid ? 'border-error-100' : 'border-gray-300',
								)}
								placeholder='شماره همراه خود را وارد کنید'
								{...field}
							/>
							{isTouched && invalid && <span className='error-message'>{error?.message}</span>}
						</div>
					</label>
				)}
			/>

			<Button type='submit' disabled={!isValid} className='btn-primary h-48 gap-4 rounded shadow'>
				ادامه
				<ArrowLeftSVG />
			</Button>
		</form>
	);
};

export default PhoneNumberForm;
