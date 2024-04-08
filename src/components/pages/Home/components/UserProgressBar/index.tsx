import { useTranslations } from 'next-intl';
import Section from '../../common/Section';

const UserProgressBar = () => {
	const t = useTranslations();

	return <Section id='user_progress_bar' title={t('home.user_progress_bar')} />;
};

export default UserProgressBar;
