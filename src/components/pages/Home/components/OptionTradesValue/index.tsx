import { useTranslations } from 'next-intl';
import Section from '../../common/Section';

const OptionTradesValue = () => {
	const t = useTranslations();

	return (
		<Section
			id='option_trades_value'
			title={t('home.option_trades_value')}
			tabs={{
				top: [
					{ id: 'tab_day', title: t('home.tab_day') },
					{ id: 'tab_week', title: t('home.tab_week') },
					{ id: 'tab_month', title: t('home.tab_month') },
					{ id: 'tab_year', title: t('home.tab_year') },
				],
				bottom: [
					{ id: 'tab_value_process', title: t('home.tab_value_process') },
					{ id: 'tab_put_option_relative_call', title: t('home.tab_put_option_relative_call') },
				],
			}}
		/>
	);
};

export default OptionTradesValue;
