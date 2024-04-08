import { useTranslations } from 'next-intl';
import Section from '../../common/Section';

const TopBaseAssets = () => {
	const t = useTranslations();

	return <Section title={t('home.top_base_assets')} />;
};

export default TopBaseAssets;
