import Loading from '@/components/common/Loading';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Section from '../../common/Section';

const MeetingTable = dynamic(() => import('./MeetingTable'), {
	loading: () => <Loading />,
});

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
			<div className='flex-1 overflow-hidden p-8'>
				<MeetingTable type={type} />
			</div>
		</Section>
	);
};

export default Meetings;
