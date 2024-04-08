import { useTranslations } from 'next-intl';
import Section from '../../common/Section';

const OpenPositionsProcess = () => {
	const t = useTranslations();

	return (
		<Section
			id='open_positions_process'
			title={t('home.open_positions_process')}
			tabs={{
				top: [
					{ id: 'tab_day', title: t('home.tab_day') },
					{ id: 'tab_week', title: t('home.tab_week') },
					{ id: 'tab_month', title: t('home.tab_month') },
					{ id: 'tab_year', title: t('home.tab_year') },
				],
			}}
		/>
	);
};

export default OpenPositionsProcess;
