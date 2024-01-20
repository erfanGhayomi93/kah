import { useAppDispatch } from '@/features/hooks';
import { toggleLoginModal } from '@/features/slices/modalSlice';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface WelcomeProps {
	loginResult: null | OAuthAPI.ILoginFirstStep;
}

const Welcome = ({ loginResult }: WelcomeProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const onCloseModal = () => {
		dispatch(toggleLoginModal(false));
	};

	const isNewUser = loginResult?.state === 'NewUser';

	return (
		<div className='flex flex-1 flex-col items-center justify-between'>
			<div className={clsx('flex-1 flex-column flex-justify-center', isNewUser ? 'gap-24' : 'gap-64')}>
				<Image
					width={isNewUser ? '280' : '398'}
					height={isNewUser ? '248' : '350'}
					alt='welcome'
					src='/static/images/welcome.svg'
				/>
				<h1 className='text-center text-4xl font-bold text-primary-300'>{t('login_modal.welcome')}</h1>
			</div>

			{isNewUser && (
				<div className='flex w-full flex-col gap-24 px-64'>
					<h3 className='text-center text-base font-bold text-primary-300'>
						{t('login_modal.set_password_description')}
					</h3>

					<div className='gap-16 flex-column'>
						<button type='button' className='h-48 rounded btn-primary'>
							{t('login_modal.set_password_btn')}
						</button>

						<button onClick={onCloseModal} type='button' className='font-medium text-primary-300'>
							{t('common.ignore')}
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Welcome;
