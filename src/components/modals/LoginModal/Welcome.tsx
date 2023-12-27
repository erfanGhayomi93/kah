import { useAppDispatch } from '@/features/hooks';
import { toggleLoginModal } from '@/features/slices/modalSlice';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const Welcome = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const onCloseModal = () => {
		dispatch(toggleLoginModal(false));
	};

	return (
		<div className='flex flex-1 flex-col items-center justify-between'>
			<div className='flex flex-col gap-24'>
				<Image width='280' height='248' alt='welcome' src='/static/images/successfully-login.png' />
				<h1 className='text-center text-4xl font-bold text-primary-300'>{t('authentication_modal.welcome')}</h1>
			</div>

			<div className='flex w-full flex-col gap-24 px-64'>
				<h3 className='text-center text-base font-bold text-primary-300'>{t('authentication_modal.set_password_description')}</h3>

				<div className='flex flex-col gap-16'>
					<button type='button' className='h-48 rounded btn-primary'>
						{t('authentication_modal.set_password_btn')}
					</button>

					<button onClick={onCloseModal} type='button' className='font-medium text-primary-300'>
						{t('common.ignore')}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Welcome;
