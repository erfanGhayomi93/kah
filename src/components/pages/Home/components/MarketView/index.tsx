import { useGetIndexQuery } from '@/api/queries/dashboardQueries';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Section from '../../common/Section';
import Suspend from '../../common/Suspend';
import MarketViewChart from './MarketViewChart';

interface IDefaultActiveTab {
	top: Dashboard.TInterval;
	bottom: Dashboard.TIndex;
}

const MarketView = () => {
	const t = useTranslations();

	const [defaultTab, setDefaultTab] = useState<IDefaultActiveTab>({
		top: 'Today',
		bottom: 'Overall',
	});

	const setDefaultTabByPosition = <T extends keyof IDefaultActiveTab>(position: T, value: IDefaultActiveTab[T]) => {
		setDefaultTab((prev) => ({
			...prev,
			[position]: value,
		}));
	};

	const { data, isFetching } = useGetIndexQuery({
		queryKey: ['getIndexQuery', defaultTab.top, defaultTab.bottom],
	});

	return (
		<Section<Dashboard.TInterval, Dashboard.TIndex>
			id='market_view'
			title={t('home.market_view')}
			defaultTopActiveTab={defaultTab.top}
			defaultBottomActiveTab={defaultTab.bottom}
			onTopTabChange={(v) => setDefaultTabByPosition('top', v)}
			onBottomTabChange={(v) => setDefaultTabByPosition('bottom', v)}
			tabs={{
				top: [
					{ id: 'Today', title: t('home.tab_day') },
					{ id: 'Week', title: t('home.tab_week') },
					{ id: 'Month', title: t('home.tab_month') },
					{ id: 'ThreeMonths', title: t('home.tab_3month') },
					{ id: 'Year', title: t('home.tab_year') },
				],
				bottom: [
					{ id: 'Overall', title: t('home.tab_overall_index') },
					{ id: 'EqualWeightOverall', title: t('home.tab_same_weight_index') },
					{ id: 'RetailTrades', title: t('home.tab_small_trades_value') },
				],
			}}
		>
			<div className='relative flex-1 overflow-hidden py-8'>
				<MarketViewChart interval={defaultTab.top} data={data ?? []} />
				<Suspend isLoading={isFetching} isEmpty={!data?.length} />
			</div>
		</Section>
	);
};

export default MarketView;
