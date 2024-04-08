import { useTranslations } from 'next-intl';
import Section from '../../common/Section';

const CompareTransactionValue = () => {
	const t = useTranslations();

	return (
		<Section
			title={t('home.compare_transaction_value')}
			tabs={{
				top: [
					{ id: 'tab_day', title: t('home.tab_day') },
					{ id: 'tab_week', title: t('home.tab_week') },
					{ id: 'tab_month', title: t('home.tab_month') },
					{ id: 'tab_year', title: t('home.tab_year') },
				],
				bottom: [
					{ id: 'tab_option_relative_market', title: t('home.tab_option_relative_market') },
					{ id: 'tab_call_market_option', title: t('home.tab_call_market_option') },
					{ id: 'tab_put_market_option', title: t('home.tab_put_market_option') },
				],
			}}
		/>
	);
};

export default CompareTransactionValue;
