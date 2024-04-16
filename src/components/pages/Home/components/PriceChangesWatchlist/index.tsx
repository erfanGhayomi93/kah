import Loading from '@/components/common/Loading';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Section from '../../common/Section';

const PriceChangesWatchlistChart = dynamic(() => import('./PriceChangesWatchlistChart'), {
	loading: () => <Loading />,
});

const PriceChangesWatchlist = () => {
	const t = useTranslations();

	return (
		<Section id='price_changes_watchlist' title={t('home.price_changes_watchlist')}>
			<div className='relative flex-1 overflow-hidden py-8'>
				<PriceChangesWatchlistChart />
			</div>
		</Section>
	);
};

export default PriceChangesWatchlist;
