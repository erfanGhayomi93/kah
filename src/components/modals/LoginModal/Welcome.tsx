import { useAppDispatch } from '@/features/hooks';
import { toggleLoginModal } from '@/features/slices/modalSlice';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect } from 'react';

interface WelcomeProps {
	isNeedsToSetPassword: boolean;
	goToSetPassword: () => void;
}

const Welcome = ({ isNeedsToSetPassword, goToSetPassword }: WelcomeProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const onCloseModal = () => {
		dispatch(toggleLoginModal(null));
	};

	useEffect(() => {
		if (isNeedsToSetPassword) return;

		const timer = setTimeout(() => {
			onCloseModal();
		}, 1500);

		return () => {
			clearTimeout(timer);
		};
	}, []);

	return (
		<div className='flex-1 items-center flex-column'>
			<div
				className={clsx(
					'flex-1 items-center flex-column',
					isNeedsToSetPassword ? 'gap-64' : 'justify-center gap-24',
				)}
			>
				<Image
					width={isNeedsToSetPassword ? '280' : '398'}
					height={isNeedsToSetPassword ? '248' : '350'}
					alt='welcome'
					src='/static/images/welcome.svg'
					quality='1'
				/>
				<h1 className='text-center text-4xl font-bold text-primary-300'>{t('login_modal.welcome')}</h1>
			</div>

			{isNeedsToSetPassword && (
				<div
					style={{
						bottom: '2.4rem',
					}}
					className='absolute w-full gap-24 px-64 flex-column'
				>
					<h3 className='text-center text-base font-bold text-gray-1000'>
						{t('login_modal.set_password_description')}
					</h3>

					<div className='w-full gap-16 px-32 flex-column'>
						<button onClick={goToSetPassword} type='button' className='h-48 rounded btn-primary'>
							{t('login_modal.set_password_btn')}
						</button>

						<button onClick={onCloseModal} type='button' className='font-medium text-primary-300'>
							{t('login_modal.skip_set_password')}
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Welcome;
