import Button from '@/components/common/Button';
import { ArrowLeftSVG } from '@/components/icons';
import { cn } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';

interface Inputs {
	phoneNumber: string;
}

interface PhoneNumberFormProps {
	goToOTP: () => void;
	setPhoneNumber: (phoneNumber: string) => void;
	sendOTP: (pNumber?: string) => Promise<OAuthAPI.IForgetPasswordFirstStep>;
	setResult: (value: OAuthAPI.IForgetPasswordFirstStep) => void;
}

const PhoneNumberForm = ({ setResult, setPhoneNumber, sendOTP, goToOTP }: PhoneNumberFormProps) => {
	const t = useTranslations();

	const {
		control,
		formState: { isValid, isSubmitting },
		setError,
		handleSubmit,
	} = useForm<Inputs>({ mode: 'onChange' });

	const onSubmit: SubmitHandler<Inputs> = async ({ phoneNumber }) => {
		sendOTP(phoneNumber)
			.then(() => {
				setPhoneNumber(phoneNumber);
				goToOTP();
			})
			.catch(() => {
				setError('phoneNumber', {
					message: t('i_errors.undefined_error'),
					type: 'value',
				});
			});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} method='get' className='flex-1 justify-between px-64 flex-column'>
			<div style={{ marginTop: '12rem' }} className='gap-24 flex-column'>
				<Controller
					defaultValue=''
					control={control}
					name='phoneNumber'
					rules={{
						validate: (value) => {
							if (value.length === 12 && /^989\d{9}$/.test(value)) return undefined;
							if (value.length === 11 && /^09\d{9}$/.test(value)) return undefined;
							return t('i_errors.invalid_phone_number');
						},
					}}
					render={({ field, fieldState: { invalid, isTouched, error } }) => (
						<label className={cn('input-box', !(isTouched && invalid) && 'pb-8')}>
							<span className='label'>{t('inputs.phone_number')}</span>
							<input
								title={t('inputs.phone_number_placeholder')}
								autoFocus
								type='text'
								inputMode='numeric'
								maxLength={12}
								className={cn('input', isTouched && invalid && 'invalid')}
								placeholder={t('inputs.phone_number_placeholder')}
								{...field}
							/>
							{isTouched && invalid && <span className='i-error'>{error?.message}</span>}
						</label>
					)}
				/>
			</div>

			<Button
				style={{
					bottom: '6.4rem',
					width: 'calc(100% - 17.6rem)',
				}}
				loading={isSubmitting}
				type='submit'
				disabled={!isValid}
				className='!absolute h-48 gap-4 rounded text-lg shadow btn-primary'
			>
				{t('common.continue')}
				<ArrowLeftSVG />
			</Button>
		</form>
	);
};

export default PhoneNumberForm;
