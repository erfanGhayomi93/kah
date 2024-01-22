import axios from '@/api/axios';
import routes from '@/api/routes';
import Button from '@/components/common/Button';
import { EyeSVG, EyeSlashSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { toggleLoginModal } from '@/features/slices/modalSlice';
import { setLoggedIn } from '@/features/slices/uiSlice';
import { base64encode, passwordValidation } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

interface Inputs {
	newPassword: string;
	repeatNewPassword: string;
}

const SetPasswordForm = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const {
		formState: { isValid, touchedFields, isSubmitting, errors },
		register,
		handleSubmit,
		setError,
		watch,
		trigger,
	} = useForm<Inputs>({ mode: 'onChange' });

	const [passwordVisibility, setPasswordVisibility] = useState<Record<keyof Inputs, boolean>>({
		newPassword: false,
		repeatNewPassword: false,
	});

	const newPassword = watch('newPassword');

	const onSubmit: SubmitHandler<Inputs> = async ({ newPassword, repeatNewPassword }) => {
		if (newPassword !== repeatNewPassword)
			void setError('repeatNewPassword', { message: t('i_errors.invalid_repeat_password'), type: 'validate' });

		try {
			const response = await axios.post<ServerResponse<OAuthAPI.IChangePassword>>(
				routes.authentication.ChangePassword,
				{
					newPassword: base64encode(newPassword),
				},
			);
			const { data } = response;

			if (response.status !== 200 || !data.succeeded) throw new Error(data.errors?.[0] ?? '');

			if (data.result.message !== 'Successful') throw new Error();

			dispatch(setLoggedIn(true));
			onCloseModal();
		} catch (e) {
			setError('newPassword', {
				message: t('i_errors.undefined_error'),
				type: 'value',
			});
		}
	};

	const onCloseModal = () => {
		dispatch(toggleLoginModal(false));
	};

	const setFieldPasswordVisibility = <T extends keyof Inputs>(field: T, visibility: boolean) => {
		setPasswordVisibility((prev) => ({
			...prev,
			[field]: visibility,
		}));
	};

	const passwordRequirements = useMemo(() => passwordValidation(newPassword ?? ''), [newPassword]);

	useEffect(() => {
		trigger('repeatNewPassword');
	}, [newPassword, trigger]);

	return (
		<form onSubmit={handleSubmit(onSubmit)} method='get' className='flex flex-1 flex-col gap-24 px-64 pt-32'>
			<label className='input-box'>
				<span className='label'>{t('inputs.new_password')}</span>
				<div
					className={clsx(
						'flex-items-center input',
						touchedFields.newPassword && errors.newPassword?.message && 'invalid',
					)}
				>
					<input
						title={t('inputs.new_password_placeholder')}
						autoFocus
						type={passwordVisibility.newPassword ? 'text' : 'password'}
						inputMode='numeric'
						maxLength={72}
						className='flex-1 text-right ltr'
						placeholder={t('inputs.new_password_placeholder')}
						{...register('newPassword')}
					/>

					<button
						onClick={() => setFieldPasswordVisibility('newPassword', !passwordVisibility.newPassword)}
						type='button'
						className='border-r-0 prefix'
					>
						{passwordVisibility.newPassword ? <EyeSlashSVG /> : <EyeSVG />}
					</button>
				</div>

				<div className='flex-justify-between *:text-tiny'>
					<span className={passwordRequirements?.lowercase ? 'text-primary-300' : 'text-gray-400'}>
						{t('forget_password_modal.password_english_words')}
					</span>
					<span className={passwordRequirements?.length ? 'text-primary-300' : 'text-gray-400'}>
						{t('forget_password_modal.password_min_chars')}
					</span>
					<span className={passwordRequirements?.uppercase ? 'text-primary-300' : 'text-gray-400'}>
						{t('forget_password_modal.password_include_uppercase_chars')}
					</span>
					<span className={passwordRequirements?.numbers ? 'text-primary-300' : 'text-gray-400'}>
						{t('forget_password_modal.password_english_include_number')}
					</span>
				</div>
			</label>

			<label className={clsx('input-box')}>
				<span className='label'>{t('inputs.repeat_new_password')}</span>
				<div className={clsx('flex-items-center input')}>
					<input
						title={t('inputs.repeat_new_password_placeholder')}
						autoFocus
						type={passwordVisibility.repeatNewPassword ? 'text' : 'password'}
						inputMode='numeric'
						maxLength={72}
						className='flex-1 text-right ltr'
						placeholder={t('inputs.repeat_new_password_placeholder')}
						{...register('repeatNewPassword', {
							required: true,
							validate: (val) => {
								if (newPassword !== val) return t('i_errors.invalid_repeat_password');
							},
						})}
					/>

					<button
						onClick={() =>
							setFieldPasswordVisibility('repeatNewPassword', !passwordVisibility.repeatNewPassword)
						}
						type='button'
						className='border-r-0 prefix'
					>
						{passwordVisibility.repeatNewPassword ? <EyeSlashSVG /> : <EyeSVG />}
					</button>
				</div>

				{touchedFields.repeatNewPassword && errors.repeatNewPassword?.message && (
					<span className='i-error'>{errors.repeatNewPassword.message}</span>
				)}
			</label>

			<div
				style={{
					bottom: '2rem',
					width: 'calc(100% - 17.6rem)',
				}}
				className='!absolute flex flex-col gap-8 pt-24'
			>
				<Button
					loading={isSubmitting}
					type='submit'
					disabled={!isValid}
					className='h-48 rounded shadow btn-primary'
				>
					{t('login_modal.register_password_btn')}
				</Button>

				<button type='button' onClick={onCloseModal} className='h-48 font-medium text-secondary-300'>
					{t('common.cancel')}
				</button>
			</div>
		</form>
	);
};

export default SetPasswordForm;
