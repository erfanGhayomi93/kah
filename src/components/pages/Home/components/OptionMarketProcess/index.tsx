import { useGetMarketProcessChartQuery } from '@/api/queries/dashboardQueries';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Section from '../../common/Section';

const OptionMarketProcessChart = dynamic(() => import('./OptionMarketProcessChart'), {
	loading: () => <Loading />,
});

interface DefaultActiveTab {
	top: Dashboard.TInterval;
	bottom: Dashboard.GetMarketProcessChart.TChartType;
}

const OptionMarketProcess = () => {
	const t = useTranslations();

	const [defaultTab, setDefaultTab] = useState<DefaultActiveTab>({
		top: 'Today',
		bottom: 'Volume',
	});

	const { data, isFetching } = useGetMarketProcessChartQuery({
		queryKey: ['getMarketProcessChartQuery', defaultTab.top, defaultTab.bottom],
	});

	const setDefaultTabByPosition = <T extends keyof DefaultActiveTab>(position: T, value: DefaultActiveTab[T]) => {
		setDefaultTab((prev) => ({
			...prev,
			[position]: value,
		}));
	};

	const dataIsEmpty = Object.keys(data ?? {}).length === 0;

	return (
		<Section<DefaultActiveTab['top'], DefaultActiveTab['bottom']>
			id='option_market_process'
			title={t('home.option_market_process')}
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
					{ id: 'Volume', title: t('home.tab_volume') },
					{ id: 'Value', title: t('home.tab_value') },
					{ id: 'NotionalValue', title: t('home.tab_notional_value') },
				],
			}}
		>
			<div className='relative flex-1 overflow-hidden'>
				<OptionMarketProcessChart interval={defaultTab.top} data={data ?? {}} />

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

export default OptionMarketProcess;
