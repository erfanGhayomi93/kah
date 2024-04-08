import { useTranslations } from 'next-intl';
import Section from '../../common/Section';

const OptionMarketProcess = () => {
	const t = useTranslations();

	return (
		<Section
			id='option_market_process'
			title={t('home.option_market_process')}
			tabs={{
				top: [
					{ id: 'tab_day', title: t('home.tab_day') },
					{ id: 'tab_week', title: t('home.tab_week') },
					{ id: 'tab_month', title: t('home.tab_month') },
					{ id: 'tab_year', title: t('home.tab_year') },
				],
				bottom: [
					{ id: 'tab_volume', title: t('home.tab_volume') },
					{ id: 'tab_value', title: t('home.tab_value') },
					{ id: 'tab_notional_value', title: t('home.tab_notional_value') },
				],
			}}
		/>
	);
};

export default OptionMarketProcess;
