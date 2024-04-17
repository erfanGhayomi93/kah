import Loading from '@/components/common/Loading';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Section from '../../common/Section';

const TopBaseAssetsTable = dynamic(() => import('./TopBaseAssetsTable'), {
	loading: () => <Loading />,
});

const TopBaseAssets = () => {
	const t = useTranslations();

	return (
		<Section id='top_base_assets' title={t('home.top_base_assets')}>
			<TopBaseAssetsTable />
		</Section>
	);
};

export default TopBaseAssets;
