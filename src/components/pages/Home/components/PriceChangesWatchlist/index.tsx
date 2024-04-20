import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Section from '../../common/Section';

const PriceChangesWatchlistChart = dynamic(() => import('./PriceChangesWatchlistChart'));

const PriceChangesWatchlist = () => {
	const t = useTranslations();

	return (
		<Section id='price_changes_watchlist' title={t('home.price_changes_watchlist')}>
			<PriceChangesWatchlistChart />
		</Section>
	);
};

export default PriceChangesWatchlist;
