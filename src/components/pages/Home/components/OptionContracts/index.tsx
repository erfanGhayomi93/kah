import { useTranslations } from 'next-intl';
import Section from '../../common/Section';

const OptionContracts = () => {
	const t = useTranslations();

	return (
		<Section
			title={t('home.option_contracts')}
			tabs={{
				top: [
					{ id: 'tab_volume', title: t('home.tab_volume') },
					{ id: 'tab_value', title: t('home.tab_value') },
				],
				bottom: [
					{ id: 'tab_contract_type', title: t('home.tab_contract_type') },
					{ id: 'tab_in_profit', title: t('home.tab_in_profit') },
				],
			}}
		/>
	);
};

export default OptionContracts;
