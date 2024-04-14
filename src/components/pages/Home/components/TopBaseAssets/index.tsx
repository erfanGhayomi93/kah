import { useGetTopOptionBaseSymbolValueQuery } from '@/api/queries/dashboardQueries';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import { useTranslations } from 'next-intl';
import Section from '../../common/Section';
import TopBaseAssetsTable from './TopBaseAssetsTable';

const TopBaseAssets = () => {
	const t = useTranslations();

	const { data, isFetching } = useGetTopOptionBaseSymbolValueQuery({
		queryKey: ['getTopOptionBaseSymbolValueQuery'],
	});

	const dataIsEmpty =
		!data ||
		Math.max(
			data.monthTopOptionBaseSymbolValues.length,
			data.todayTopOptionBaseSymbolValues.length,
			data.weekTopOptionBaseSymbolValues.length,
		) === 0;

	return (
		<Section id='top_base_assets' title={t('home.top_base_assets')}>
			<div className='relative flex-1 overflow-hidden p-8'>
				{isFetching ? <Loading /> : dataIsEmpty ? <NoData /> : <TopBaseAssetsTable data={data ?? {}} />}
			</div>
		</Section>
	);
};

export default TopBaseAssets;
