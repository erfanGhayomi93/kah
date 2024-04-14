import { useTranslations } from 'next-intl';
import Section from '../../common/Section';

const TopBaseAssets = () => {
	const t = useTranslations();

	return <Section id='top_base_assets' title={t('home.top_base_assets')} />;
};

export default TopBaseAssets;
