import { useTranslations } from 'next-intl';
import Section from '../../common/Section';

const Meetings = () => {
	const t = useTranslations();

	return (
		<Section
			title={t('home.meetings')}
			tabs={{
				bottom: [
					{ id: 'tab_capital_increase', title: t('home.tab_capital_increase') },
					{ id: 'tab_another_meetings', title: t('home.tab_another_meetings') },
				],
			}}
		/>
	);
};

export default Meetings;
