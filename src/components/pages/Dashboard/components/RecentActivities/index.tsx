import { useTranslations } from 'next-intl';
import Section from '../../common/Section';

const RecentActivities = () => {
	const t = useTranslations();

	return <Section id='recent_activities' title={t('home.recent_activities')} />;
};

export default RecentActivities;
