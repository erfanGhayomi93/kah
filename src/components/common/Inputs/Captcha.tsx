import { RefreshSVG } from '@/components/icons';
import { cn } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Controller, type Control } from 'react-hook-form';

interface CaptchaProps extends React.InputHTMLAttributes<HTMLInputElement> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: Control<any>;
}

const Captcha = ({ control, ...props }: CaptchaProps) => {
	const t = useTranslations();

	const [fetching, setFetching] = useState(false);

	const onRefetchCaptcha = () => {
		setFetching(true);
		setTimeout(() => setFetching(false), 2000);
	};

	return (
		<Controller
			defaultValue=''
			control={control}
			name='captcha'
			rules={{
				validate: (value) => {
					if (!isNaN(Number(value)) && value.length === 6) return undefined;
					return t('i_errors.invalid_captcha');
				},
			}}
			render={({ field, fieldState: { invalid, isTouched, error } }) => (
				<label className='input-box'>
					<span className='label'>{t('inputs.captcha')}</span>
					<div className={cn('flex-items-center input', isTouched && invalid && 'invalid')}>
						<input
							title={t('inputs.captcha_placeholder')}
							type='text'
							inputMode='numeric'
							maxLength={6}
							className='flex-1'
							placeholder={t('inputs.captcha_placeholder')}
							autoComplete='off'
							pattern='\d{6,6}'
							{...field}
							{...props}
						/>
						<div className='flex gap-16'>
							<div className='flex-items-center'>
								{fetching ? (
									<div className='size-24 spinner' />
								) : (
									<span className='font-bold'>123456</span>
								)}
							</div>
							<button onClick={onRefetchCaptcha} type='button' className='prefix'>
								<RefreshSVG />
							</button>
						</div>
					</div>

					{isTouched && invalid && <span className='i-error'>{error?.message}</span>}
				</label>
			)}
		/>
	);
};

export default Captcha;
