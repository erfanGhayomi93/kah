import { EyeSVG, EyeSlashSVG } from '@/components/icons';
import { cn } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Controller, type Control } from 'react-hook-form';

interface PasswordProps extends React.InputHTMLAttributes<HTMLInputElement> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: Control<any>;
	label: string;
}

const Password = ({ control, label, ...props }: PasswordProps) => {
	const t = useTranslations();

	const [showPassword, setShowPassword] = useState(false);

	return (
		<Controller
			defaultValue=''
			control={control}
			name='password'
			rules={{
				validate: (value) => {
					if (!isNaN(Number(value)) && value.length === 6) return undefined;
					return t('i_errors.invalid_password');
				},
			}}
			render={({ field, fieldState: { invalid, isTouched, error } }) => (
				<label className='input-box'>
					<span className='label'>{label}</span>
					<div className={cn('!pl-12 flex-items-center input', isTouched && invalid && 'invalid')}>
						<input
							title={t('inputs.captcha_placeholder')}
							type={showPassword ? 'text' : 'password'}
							inputMode='text'
							maxLength={6}
							className='flex-1'
							autoComplete='off'
							{...field}
							{...props}
						/>
						<button
							onClick={() => setShowPassword(!showPassword)}
							type='button'
							className='border-0 text-gray-900'
						>
							{showPassword ? <EyeSlashSVG /> : <EyeSVG />}
						</button>
					</div>

					{isTouched && invalid && <span className='i-error'>{error?.message}</span>}
				</label>
			)}
		/>
	);
};

export default Password;
