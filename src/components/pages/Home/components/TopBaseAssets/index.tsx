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
			<div className='relative flex-1 overflow-hidden p-8'>
				<TopBaseAssetsTable />
			</div>
		</Section>
	);
};

export default TopBaseAssets;
