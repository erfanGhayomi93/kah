import { useGetOptionSettlementInfoQuery } from '@/api/queries/dashboardQueries';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Section from '../../common/Section';
import DueDatesTable from './DueDatesTable';

const DueDates = () => {
	const t = useTranslations();

	const [type, setType] = useState<Dashboard.GetOptionSettlementInfo.Type>('MostRecent');

	const { data, isFetching } = useGetOptionSettlementInfoQuery({
		queryKey: ['getOptionSettlementInfoQuery', type],
	});

	return (
		<Section<string, Dashboard.GetOptionSettlementInfo.Type>
			id='due_dates'
			title={t('home.due_dates')}
			defaultBottomActiveTab={type}
			onBottomTabChange={setType}
			tabs={{
				bottom: [
					{ id: 'MostRecent', title: t('home.tab_newest') },
					{ id: 'Closest', title: t('home.tab_closest') },
				],
			}}
		>
			<div className='relative flex-1 overflow-hidden p-8'>
				{isFetching ? (
					<Loading />
				) : !data?.length ? (
					<NoData />
				) : (
					<DueDatesTable type={type} data={data ?? {}} />
				)}
			</div>
		</Section>
	);
};

export default DueDates;
