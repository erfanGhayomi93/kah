'use client';
import { useAppSelector } from '@/features/hooks';
import { getIsLoggedIn } from '@/features/slices/userSlice';
import { useTranslations } from 'next-intl';
import SettingCard from '../../components/SettingCard';
import KahkeshanInfo from './sections/KahkeshanInfo';
import NotificationPlacement from './sections/NotificationPlacement';
import Theme from './sections/Theme';

const General = () => {
	const t = useTranslations();

	const isLoggedIn = useAppSelector(getIsLoggedIn);

	return (
		<div className='flex-1 gap-8 flex-column'>
			{isLoggedIn && (
				<SettingCard title={t('settings_page.general_info_title')}>
					<KahkeshanInfo />
				</SettingCard>
			)}

			<div className='gap-56 rounded bg-gray-200 p-24 flex-justify-between'>
				<p className='text-lg font-medium text-gray-900'>{t('settings_page.background_color')}</p>
				<Theme />
			</div>
			<SettingCard title={t('settings_page.notification_placement')}>
				<NotificationPlacement />
			</SettingCard>
		</div>
	);
};

export default General;
