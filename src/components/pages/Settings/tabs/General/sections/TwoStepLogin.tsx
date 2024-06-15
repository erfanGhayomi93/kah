import { CheckSVG, ShieldCheckSVG } from '@/components/icons';
import { useTranslations } from 'next-intl';

const TwoStepLogin = () => {
	const t = useTranslations();

	return (
		<div className='font-normal text-light-gray-800'>
			<p className='mb-16 text-lg flex-justify-start'>
				<span className='text-light-success-100'>
					<CheckSVG width='3.5rem' height='3.5rem' />
				</span>

				{t('settings_page.two_step_login_greeting')}
			</p>

			<p className='mb-40 text-base'>{t('settings_page.two_step_login_description')}</p>
			<button
				type='button'
				className='h-40 gap-8 rounded px-36 flex-justify-center btn-success hover:bg-light-success-100'
			>
				<ShieldCheckSVG width='2.4rem' height='2.4rem' />
				{t('settings_page.two_step_login_btn_title')}
			</button>
		</div>
	);
};

export default TwoStepLogin;
