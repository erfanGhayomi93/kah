import { useGetOpenPositionProcessQuery } from '@/api/queries/dashboardQueries';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Section from '../../common/Section';

const OpenPositionsProcessChart = dynamic(() => import('./OpenPositionsProcessChart'), {
	loading: () => <Loading />,
});

const OpenPositionsProcess = () => {
	const t = useTranslations();

	const [interval, setInterval] = useState<Dashboard.TInterval>('Today');

	const { data, isFetching } = useGetOpenPositionProcessQuery({
		queryKey: ['getOpenPositionProcessQuery', interval],
	});

	const dataIsEmpty = Object.keys(data ?? {}).length === 0;

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
		>
			<div className='relative flex-1 overflow-hidden'>
				<OpenPositionsProcessChart data={data ?? {}} />

				{isFetching ? (
					<div className='absolute size-full bg-white center'>
						<Loading />
					</div>
				) : (
					dataIsEmpty && (
						<div className='absolute size-full bg-white center'>
							<NoData />
						</div>
					)
				)}
			</div>
		</Section>
	);
};

export default OpenPositionsProcess;
