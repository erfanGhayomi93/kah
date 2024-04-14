import { useGetAnnualReportQuery } from '@/api/queries/dashboardQueries';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Section from '../../common/Section';
import MeetingTable from './MeetingTable';

const Meetings = () => {
	const t = useTranslations();

	const [type, setType] = useState<Dashboard.GetAnnualReport.Type>('FundIncrease');

	const { data, isFetching } = useGetAnnualReportQuery({
		queryKey: ['getAnnualReportQuery', type],
	});

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
				{isFetching ? <Loading /> : !data?.length ? <NoData /> : <MeetingTable data={data ?? []} />}
			</div>
		</Section>
	);
};

export default Meetings;
