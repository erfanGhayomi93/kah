import { useTranslations } from 'next-intl';
import Section from '../../common/Section';

const IndividualAndLegal = () => {
	const t = useTranslations();

	return (
		<Section
			id='individual_and_legal'
			title={t('home.individual_and_legal')}
			tabs={{
				top: [
					{ id: 'tab_option', title: t('home.tab_option') },
					{ id: 'tab_base_symbol', title: t('home.tab_base_symbol') },
				],
				bottom: [
					{ id: 'tab_legal_volume', title: t('home.tab_legal_volume') },
					{ id: 'tab_individual_capita', title: t('home.tab_individual_capita') },
				],
			}}
		/>
	);
};

export default IndividualAndLegal;
