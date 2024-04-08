import { useTranslations } from 'next-intl';
import Section from '../../common/Section';

const Best = () => {
	const t = useTranslations();

	return (
		<Section
			title={t('home.best')}
			tabs={{
				top: [
					{ id: 'tab_option', title: t('home.tab_option') },
					{ id: 'tab_base_symbol', title: t('home.tab_base_symbol') },
					{ id: 'tab_symbol', title: t('home.tab_symbol') },
				],
				bottom: [
					{ id: 'tab_option_position', title: t('home.tab_option_position') },
					{ id: 'tab_trades_count', title: t('home.tab_trades_count') },
					{ id: 'tab_changes_from_previous_day', title: t('home.tab_changes_from_previous_day') },
					{ id: 'tab_trades_volume', title: t('home.tab_trades_volume') },
				],
			}}
		/>
	);
};

export default Best;
