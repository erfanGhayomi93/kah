import { useTranslations } from 'next-intl';
import Section from '../../common/Section';

const MarketView = () => {
	const t = useTranslations();

	return (
		<Section
			id='market_view'
			title={t('home.market_view')}
			tabs={{
				top: [
					{ id: 'tab_day', title: t('home.tab_day') },
					{ id: 'tab_week', title: t('home.tab_week') },
					{ id: 'tab_month', title: t('home.tab_month') },
					{ id: 'tab_3month', title: t('home.tab_3month') },
					{ id: 'tab_year', title: t('home.tab_year') },
				],
				bottom: [
					{ id: 'overall_index', title: t('home.tab_overall_index') },
					{ id: 'same_weight_index', title: t('home.tab_same_weight_index') },
					{ id: 'small_trades_value', title: t('home.tab_small_trades_value') },
				],
			}}
		/>
	);
};

export default MarketView;
