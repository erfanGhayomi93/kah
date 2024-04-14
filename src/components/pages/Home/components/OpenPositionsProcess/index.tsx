import { useGetOpenPositionProcessQuery } from '@/api/queries/dashboardQueries';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Section from '../../common/Section';

const OpenPositionsProcess = () => {
	const t = useTranslations();

	const [interval, setInterval] = useState<Dashboard.TInterval>('Today');

	const { data } = useGetOpenPositionProcessQuery({
		queryKey: ['getOpenPositionProcessQuery', interval],
	});

	return (
		<Section<Dashboard.TInterval>
			id='open_positions_process'
			title={t('home.open_positions_process')}
			defaultTopActiveTab={interval}
			onTopTabChange={setInterval}
			tabs={{
				top: [
					{ id: 'Today', title: t('home.tab_day') },
					{ id: 'Week', title: t('home.tab_week') },
					{ id: 'Month', title: t('home.tab_month') },
					{ id: 'Year', title: t('home.tab_year') },
				],
			}}
		/>
	);
};

export default OpenPositionsProcess;
