import { useGetOptionWatchlistPriceChangeInfoQuery } from '@/api/queries/dashboardQueries';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Section from '../../common/Section';

const PriceChangesWatchlistChart = dynamic(() => import('./PriceChangesWatchlistChart'), {
	loading: () => <Loading />,
});

const PriceChangesWatchlist = () => {
	const t = useTranslations();

	const { data, isFetching } = useGetOptionWatchlistPriceChangeInfoQuery({
		queryKey: ['getOptionWatchlistPriceChangeInfoQuery'],
	});

	return (
		<Section id='price_changes_watchlist' title={t('home.price_changes_watchlist')}>
			<div className='relative flex-1 overflow-hidden'>
				<PriceChangesWatchlistChart data={data ?? []} />

				{isFetching ? (
					<div className='absolute size-full bg-white center'>
						<Loading />
					</div>
				) : (
					!data?.length && (
						<div className='absolute size-full bg-white center'>
							<NoData />
						</div>
					)
				)}
			</div>
		</Section>
	);
};

export default PriceChangesWatchlist;
