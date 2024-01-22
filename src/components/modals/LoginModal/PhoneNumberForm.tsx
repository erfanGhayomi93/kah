import Button from '@/components/common/Button';
import { ArrowLeftSVG } from '@/components/icons';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import Captcha from '../../common/Inputs/Captcha';

interface Inputs {
	phoneNumber: string;
	captcha: string;
}

interface PhoneNumberFormProps {
	sendOTP: (phoneNumber: string) => Promise<void>;
	setLoginResult: (value: OAuthAPI.ILoginFirstStep) => void;
}

const PhoneNumberForm = ({ setLoginResult, sendOTP }: PhoneNumberFormProps) => {
	const t = useTranslations();

	const {
		control,
		formState: { isValid, touchedFields, isSubmitting, errors },
		setError,
		handleSubmit,
	} = useForm<Inputs>({ mode: 'onChange' });

	const onSubmit: SubmitHandler<Inputs> = ({ phoneNumber, captcha }) =>
		new Promise<void>((resolve, reject) => {
			sendOTP(phoneNumber)
				.catch((e) => {
					const { message } = e as Error;

					switch (message) {
						case 'TooManyRequest':
							setError('phoneNumber', {
								message: t('i_errors.too_many_request'),
								type: 'value',
							});
							break;
						default:
							setError('phoneNumber', {
								message: t('i_errors.too_many_request'),
								type: 'value',
							});
					}
				})
				.finally(() => {
					resolve();
				});
		});

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
				name='phoneNumber'
				rules={{
					validate: (value) => {
						if (value.length === 12 && /^989\d{9}$/.test(value)) return undefined;
						if (value.length === 11 && /^09\d{9}$/.test(value)) return undefined;
						return t('i_errors.invalid_phone_number');
					},
				}}
				render={({ field, fieldState: { invalid, isTouched, error } }) => (
					<label className={clsx('input-box', !(isTouched && invalid) && 'pb-8')}>
						<span className='label'>{t('inputs.phone_number')}</span>
						<input
							title={t('inputs.phone_number_placeholder')}
							autoFocus
							type='text'
							inputMode='numeric'
							maxLength={12}
							className={clsx('input', isTouched && invalid && 'invalid')}
							placeholder={t('inputs.phone_number_placeholder')}
							{...field}
						/>
						{isTouched && invalid && <span className='i-error'>{error?.message}</span>}
					</label>
				)}
			/>

			{hasCaptcha && <Captcha control={control} />}

			<Button
				style={{
					bottom:
						hasCaptcha && Object.keys(touchedFields).length > 1 && Object.keys(errors).length > 1
							? '5.6rem'
							: '11.6rem',
					width: 'calc(100% - 17.6rem)',
				}}
				loading={isSubmitting}
				type='submit'
				disabled={!isValid}
				className='!absolute h-48 gap-4 rounded shadow btn-primary'
			>
				{t('common.continue')}
				<ArrowLeftSVG />
			</Button>
		</form>
	);
};

export default PhoneNumberForm;
