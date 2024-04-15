import { useGetOptionTradeProcessQuery } from '@/api/queries/dashboardQueries';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Section from '../../common/Section';

const OptionTradesValueChart = dynamic(() => import('./OptionTradesValueChart'), {
	loading: () => <Loading />,
});

interface DefaultActiveTab {
	top: Dashboard.TInterval;
	bottom: Dashboard.GetOptionTradeProcess.TChartType;
}

const OptionTradesValue = () => {
	const t = useTranslations();

	const [defaultTab, setDefaultTab] = useState<DefaultActiveTab>({
		top: 'Today',
		bottom: 'Process',
	});

	const { data, isFetching } = useGetOptionTradeProcessQuery({
		queryKey: ['getOptionTradeProcessQuery', defaultTab.top],
	});

	const setDefaultTabByPosition = <T extends keyof DefaultActiveTab>(position: T, value: DefaultActiveTab[T]) => {
		setDefaultTab((prev) => ({
			...prev,
			[position]: value,
		}));
	};

	return (
		<Section<DefaultActiveTab['top'], DefaultActiveTab['bottom']>
			id='option_trades_value'
			title={t('home.option_trades_value')}
			defaultTopActiveTab={defaultTab.top}
			defaultBottomActiveTab={defaultTab.bottom}
			onTopTabChange={(v) => setDefaultTabByPosition('top', v)}
			onBottomTabChange={(v) => setDefaultTabByPosition('bottom', v)}
			tabs={{
				top: [
					{ id: 'Today', title: t('home.tab_day') },
					{ id: 'Week', title: t('home.tab_week') },
					{ id: 'Month', title: t('home.tab_month') },
					{ id: 'Year', title: t('home.tab_year') },
				],
				bottom: [
					{ id: 'Process', title: t('home.tab_value_process') },
					{ id: 'PutToCall', title: t('home.tab_put_option_relative_call') },
				],
			}}
		>
			<div className='relative flex-1 overflow-hidden'>
				<OptionTradesValueChart data={data ?? []} interval={defaultTab.top} type={defaultTab.bottom} />

				{isFetching ? (
					<div className='absolute size-full bg-white center'>
						<Loading />
					</div>
				) : (
					!data?.length && (
						<div className='absolute size-full bg-white center'>
							<NoData />
						</div>
					)
				)}
			</div>
		</Section>
	);
};

export default OptionTradesValue;
