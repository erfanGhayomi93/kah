import { cn } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect } from 'react';

interface WelcomeProps {
	isNeedsToSetPassword: boolean;
	goToSetPassword: () => void;
	onCloseModal: () => void;
}

const Welcome = ({ isNeedsToSetPassword, goToSetPassword, onCloseModal }: WelcomeProps) => {
	const t = useTranslations();

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
				className={cn(
					'flex-1 items-center flex-column',
					isNeedsToSetPassword ? 'justify-center gap-24' : 'gap-64',
				)}
			>
				<Image
					width={isNeedsToSetPassword ? '280' : '398'}
					height={isNeedsToSetPassword ? '248' : '350'}
					alt='welcome'
					quality='1'
					src='/static/images/welcome.svg'
				/>
				<h2 className='text-center text-4xl font-bold text-gray-1000'>{t('login_modal.welcome')}</h2>
			</div>

			{isNeedsToSetPassword && (
				<div className='w-full gap-56 px-64 flex-column'>
					<p className='text-center text-base font-bold text-gray-1000'>
						{t('login_modal.set_password_description')}
					</p>

					<div className='gap-8 pb-16 flex-column'>
						<button
							onClick={goToSetPassword}
							type='button'
							className='h-48 rounded font-medium btn-primary'
						>
							{t('login_modal.set_password_btn')}
						</button>

						<button onClick={onCloseModal} type='button' className='h-40 font-medium text-primary-400'>
							{t('login_modal.skip_set_password')}
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Welcome;
