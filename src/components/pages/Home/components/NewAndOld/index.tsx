import { useTranslations } from 'next-intl';
import Section from '../../common/Section';

const NewAndOld = () => {
	const t = useTranslations();

	return (
		<Section
			id='new_and_old'
			title={t('home.new_and_old')}
			tabs={{
				bottom: [
					{ id: 'tab_new_trades', title: t('home.tab_new_trades') },
					{ id: 'tab_most_trading_day', title: t('home.tab_most_trading_day') },
				],
			}}
		/>
	);
};

export default NewAndOld;
