import { useTranslations } from 'next-intl';
import Section from '../../common/Section';

const MarketStatus = () => {
	const t = useTranslations();

	return (
		<Section
			id='market_status'
			title={t('home.market_status')}
			tabs={{
				bottom: [
					{ id: 'tab_option', title: t('home.tab_option') },
					{ id: 'tab_bourse', title: t('home.tab_bourse') },
					{ id: 'tab_fara_bourse', title: t('home.tab_fara_bourse') },
				],
			}}
		/>
	);
};

export default MarketStatus;
