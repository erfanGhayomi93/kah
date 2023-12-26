import { RefreshSVG } from '@/components/icons';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Controller, type Control } from 'react-hook-form';

interface CaptchaProps extends React.InputHTMLAttributes<HTMLInputElement> {
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
					<div className={clsx('flex-items-center input', isTouched && invalid && 'invalid')}>
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
								{fetching ? <div className='spinner h-24 w-24' /> : <span className='font-bold'>123456</span>}
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
