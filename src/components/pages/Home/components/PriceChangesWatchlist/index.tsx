import { useTranslations } from 'next-intl';
import Section from '../../common/Section';

const PriceChangesWatchlist = () => {
	const t = useTranslations();

	return <Section id='price_changes_watchlist' title={t('home.price_changes_watchlist')} />;
};

export default PriceChangesWatchlist;
