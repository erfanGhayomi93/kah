import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Section from '../../common/Section';

const TopBaseAssetsTable = dynamic(() => import('./TopBaseAssetsTable'));

const TopBaseAssets = () => {
	const t = useTranslations();

	return (
		<Section id='top_base_assets' title={t('home.top_base_assets')} info={t('tooltip.top_base_assets_section')}>
			<TopBaseAssetsTable />
		</Section>
	);
};

export default TopBaseAssets;
