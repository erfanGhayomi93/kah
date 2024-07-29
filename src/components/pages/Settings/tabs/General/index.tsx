'use client';
import { useAppSelector } from '@/features/hooks';
import { getBrokerURLs } from '@/features/slices/brokerSlice';
import { getIsLoggedIn } from '@/features/slices/userSlice';
import { useTranslations } from 'next-intl';
import SettingCard from '../../components/SettingCard';
import BrokerInfo from './sections/BrokerInfo';
import Theme from './sections/Theme';
import ToastPositionSettings from './sections/ToastPosition';
import UserInfo from './sections/UserInfo';

const General = () => {
	const t = useTranslations();

	const isLoggedIn = useAppSelector(getIsLoggedIn);
	const brokerURLs = useAppSelector(getBrokerURLs);

	return (
		<div className='flex-1 gap-8 flex-column'>
			{brokerURLs && (
				<SettingCard title={t('settings_page.broker_info_title')}>
					<BrokerInfo />
				</SettingCard>
			)}

			{isLoggedIn && (
				<SettingCard title={<>{t('settings_page.general_info_title')}</>}>
					<UserInfo isLoggedIn />
				</SettingCard>
			)}

			<SettingCard title={t('settings_page.background_color')}>
				<Theme />
			</SettingCard>

			<SettingCard title={t('settings_page.notification_placement')}>
				<ToastPositionSettings />
			</SettingCard>
		</div>
	);
};

export default General;
