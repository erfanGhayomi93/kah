import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Section from '../../common/Section';

const MeetingTable = dynamic(() => import('./MeetingTable'));

const Meetings = () => {
	const t = useTranslations();

	const [type, setType] = useState<Dashboard.GetAnnualReport.Type>('FundIncrease');

	return (
		<Section<string, Dashboard.GetAnnualReport.Type>
			id='meetings'
			title={t('home.meetings')}
			defaultTopActiveTab={type}
			onBottomTabChange={setType}
			tabs={{
				bottom: [
					{ id: 'FundIncrease', title: t('home.tab_capital_increase') },
					{ id: 'Other', title: t('home.tab_another_meetings') },
				],
			}}
		>
			<MeetingTable type={type} />
		</Section>
	);
};

export default Meetings;
