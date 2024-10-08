import axios from '@/api/axios';
import routes from '@/api/routes';
import Button from '@/components/common/Button';
import { EyeSVG, EyeSlashSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setLoginModal } from '@/features/slices/modalSlice';
import { base64encode, cn, passwordValidation } from '@/utils/helpers';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';

interface Inputs {
	newPassword: string;
	repeatNewPassword: string;
}

interface SetPasswordFormProps {
	phoneNumber: string;
}

const SetPasswordForm = ({ phoneNumber }: SetPasswordFormProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const queryClient = useQueryClient();

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

	const updateUserInfoCache = () => {
		try {
			const queryKey = ['userInformationQuery'];

			let data: User.IUserInformation = queryClient.getQueryData(queryKey)!;

			if (!data) return;

			data = JSON.parse(JSON.stringify(data));
			data.hasPassword = true;

			queryClient.setQueryData(queryKey, data);
		} catch (e) {
			//
		}
	};

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

			if (data.result !== 'Successful') throw new Error();

			updateUserInfoCache();
			onCloseModal();
		} catch (e) {
			setError('newPassword', {
				message: t('i_errors.undefined_error'),
				type: 'value',
			});
		}
	};

	const onCloseModal = () => {
		dispatch(setLoginModal(null));
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

	const newPasswordFieldIsTouched = touchedFields?.newPassword;

	return (
		<form onSubmit={handleSubmit(onSubmit)} method='get' className='flex-1 justify-between px-64 pb-16 flex-column'>
			<div style={{ marginTop: '4.8rem' }} className='gap-24 flex-column'>
				<input type='hidden' name='username' value={phoneNumber ?? ''} />

				<div className='gap-8 flex-column'>
					<label className='input-box'>
						<span className='label'>{t('inputs.password')}</span>
						<div
							className={cn(
								'flex-items-center input',
								touchedFields.newPassword && errors.newPassword?.message && 'invalid',
							)}
						>
							<input
								title={t('inputs.password_placeholder')}
								autoFocus
								type={passwordVisibility.newPassword ? 'text' : 'password'}
								inputMode='numeric'
								maxLength={72}
								className='flex-1 text-right ltr'
								placeholder={t('inputs.password_placeholder')}
								{...register('newPassword')}
							/>

							<button
								onClick={() =>
									setFieldPasswordVisibility('newPassword', !passwordVisibility.newPassword)
								}
								type='button'
								className='text-gray-700 border-r-0 prefix'
							>
								{passwordVisibility.newPassword ? <EyeSlashSVG /> : <EyeSVG />}
							</button>
						</div>
					</label>

					<div className='flex gap-32'>
						<div className='gap-4 flex-column'>
							<span
								className={
									passwordRequirements?.lowercase
										? 'i-success'
										: newPasswordFieldIsTouched
											? 'i-error'
											: 'i-null'
								}
							>
								{t('forget_password_modal.password_english_words')}
							</span>
							<span
								className={
									passwordRequirements?.length
										? 'i-success'
										: newPasswordFieldIsTouched
											? 'i-error'
											: 'i-null'
								}
							>
								{t('forget_password_modal.password_min_chars')}
							</span>
						</div>

						<div className='gap-4 flex-column'>
							<span
								className={
									passwordRequirements?.uppercase
										? 'i-success'
										: newPasswordFieldIsTouched
											? 'i-error'
											: 'i-null'
								}
							>
								{t('forget_password_modal.password_include_uppercase_chars')}
							</span>
							<span
								className={
									passwordRequirements?.numbers
										? 'i-success'
										: newPasswordFieldIsTouched
											? 'i-error'
											: 'i-null'
								}
							>
								{t('forget_password_modal.password_english_include_number')}
							</span>
						</div>
					</div>
				</div>

				<label className={cn('input-box')}>
					<span className='label'>{t('inputs.repeat_new_password')}</span>
					<div className={cn('flex-items-center input')}>
						<input
							title={t('inputs.repeat_new_password_placeholder')}
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
							className='text-gray-700 border-r-0 prefix'
						>
							{passwordVisibility.repeatNewPassword ? <EyeSlashSVG /> : <EyeSVG />}
						</button>
					</div>

					{touchedFields.repeatNewPassword && errors.repeatNewPassword?.message && (
						<span className='i-error'>{errors.repeatNewPassword.message}</span>
					)}
				</label>
			</div>

			<div className='gap-8 flex-column'>
				<Button
					loading={isSubmitting}
					type='submit'
					disabled={!isValid}
					className='h-48 rounded text-lg shadow btn-primary'
				>
					{t('common.register')}
				</Button>

				<button type='button' onClick={onCloseModal} className='text-primary-100 h-40 font-medium'>
					{t('common.cancel')}
				</button>
			</div>
		</form>
	);
};

export default SetPasswordForm;
