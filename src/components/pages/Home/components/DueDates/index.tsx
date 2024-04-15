import Loading from '@/components/common/Loading';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Section from '../../common/Section';

const DueDatesTable = dynamic(() => import('./DueDatesTable'), {
	loading: () => <Loading />,
});

const DueDates = () => {
	const t = useTranslations();

	const [type, setType] = useState<Dashboard.GetOptionSettlementInfo.Type>('MostRecent');

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
				<DueDatesTable type={type} />
			</div>
		</Section>
	);
};

export default DueDates;
