import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Section from '../../common/Section';

const DueDatesTable = dynamic(() => import('./DueDatesTable'));

const DueDates = () => {
	const t = useTranslations();

	const [type, setType] = useState<Dashboard.GetOptionSettlementInfo.Type>('Closest');

	return (
		<Section<string, Dashboard.GetOptionSettlementInfo.Type>
			id='due_dates'
			title={t('home.due_dates')}
			info={t('tooltip.due_dates_section')}
			defaultBottomActiveTab={type}
			onBottomTabChange={setType}
			tabs={{
				bottom: [
					{ id: 'Closest', title: t('home.tab_closest') },
					{ id: 'MostRecent', title: t('home.tab_newest') },
				],
			}}
		>
			<DueDatesTable type={type} />
		</Section>
	);
};

export default DueDates;
