import { CheckSVG, ShieldCheckSVG } from '@/components/icons';
import { useTranslations } from 'next-intl';

const TwoStepLogin = () => {
	const t = useTranslations();

	return (
		<div className='text-gray-800 font-normal'>
			<p className='mb-16 text-lg flex-justify-start'>
				<span className='text-success-100'>
					<CheckSVG width='3.5rem' height='3.5rem' />
				</span>

				{t('settings_page.two_step_login_greeting')}
			</p>

			<p className='mb-40 text-base'>{t('settings_page.two_step_login_description')}</p>
			<button
				type='button'
				className='hover:bg-success-100 h-40 gap-8 rounded px-36 flex-justify-center btn-success'
			>
				<ShieldCheckSVG width='2.4rem' height='2.4rem' />
				{t('settings_page.two_step_login_btn_title')}
			</button>
		</div>
	);
};

export default TwoStepLogin;
