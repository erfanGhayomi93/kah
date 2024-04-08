import { useTranslations } from 'next-intl';
import Section from '../../common/Section';

const DueDates = () => {
	const t = useTranslations();

	return (
		<Section
			title={t('home.due_dates')}
			tabs={{
				bottom: [
					{ id: 'tab_newest', title: t('home.tab_newest') },
					{ id: 'tab_closest', title: t('home.tab_closest') },
				],
			}}
		/>
	);
};

export default DueDates;
