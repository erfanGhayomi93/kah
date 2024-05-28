import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Section from '../../common/Section';

const PriceChangesWatchlistChart = dynamic(() => import('./PriceChangesWatchlistChart'));

const PriceChangesWatchlist = () => {
	const t = useTranslations();

	return (
		<Section
			id='price_changes_watchlist'
			title={t('home.price_changes_watchlist')}
			info={t('tooltip.price_change_watchlist_section')}
		>
			<PriceChangesWatchlistChart />
		</Section>
	);
};

export default PriceChangesWatchlist;
