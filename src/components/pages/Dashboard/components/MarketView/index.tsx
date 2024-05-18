import {
	useGetIndexDetailsQuery,
	useGetIndexQuery,
	useGetRetailTradeValuesQuery,
} from '@/api/queries/dashboardQueries';
import { sepNumbers, toFixed } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import Section, { type ITab } from '../../common/Section';
import Suspend from '../../common/Suspend';
import MarketViewChart from './MarketViewChart';

type TIndexData = Dashboard.GetIndex.Overall | Dashboard.GetIndex.EqualWeightOverall | Dashboard.GetIndex.RetailTrades;

type TTabs = Partial<{
	top: Array<ITab<Dashboard.TInterval>> | React.ReactNode;
	bottom: Array<ITab<Dashboard.TIndex>> | React.ReactNode;
}>;

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

	const { data: indexData, isLoading: isLoadingIndex } = useGetIndexQuery({
		queryKey: ['getIndexQuery', defaultTab.top, defaultTab.bottom],
		enabled: defaultTab.bottom !== 'RetailTrades',
	});

	const { data: retailTradesData, isLoading: isLoadingRetailTrades } = useGetRetailTradeValuesQuery({
		queryKey: ['getRetailTradeValuesQuery', defaultTab.top],
		enabled: defaultTab.bottom === 'RetailTrades',
	});

	const { data: indexDetails } = useGetIndexDetailsQuery({
		queryKey: ['getIndexDetailsQuery'],
	});

	const tabs = useMemo<TTabs>(
		() => ({
			top: [
				{ id: 'Today', title: t('home.tab_day') },
				{ id: 'Week', title: t('home.tab_week') },
				{ id: 'Month', title: t('home.tab_month') },
				{ id: 'ThreeMonths', title: t('home.tab_3month') },
				{ id: 'Year', title: t('home.tab_year') },
			],
			bottom: [
				{
					id: 'Overall',
					title: (
						<>
							<span>{t('home.tab_overall_index')}:</span>
							<span className='pr-8 font-medium ltr'>
								({'\u200E' + toFixed(indexDetails?.equalWeightOverallPercent ?? 0)}%){' '}
								{' ' + sepNumbers(String(indexDetails?.equalWeightOverallValue ?? 0))}
							</span>
						</>
					),
				},
				{
					id: 'EqualWeightOverall',
					title: (
						<>
							<span>{t('home.tab_same_weight_index')}:</span>
							<span className='pr-8 font-medium ltr'>
								({'\u200E' + toFixed(indexDetails?.retailTradesPercent ?? 0)}%)
								{' ' + sepNumbers(String(indexDetails?.retailTradesValue ?? 0))}
							</span>
						</>
					),
				},
				{
					id: 'RetailTrades',
					title: (
						<>
							<span>{t('home.tab_small_trades_value')}:</span>
							<span className='pr-8 font-medium ltr'>
								({'\u200E' + toFixed(indexDetails?.retailTradesPercent ?? 0)}%){' '}
								{' ' + sepNumbers(String(indexDetails?.retailTradesValue ?? 0))}
							</span>
						</>
					),
				},
			],
		}),
		[indexDetails],
	);

	const [data, isLoading] =
		defaultTab.bottom === 'RetailTrades'
			? [retailTradesData ?? {}, isLoadingRetailTrades]
			: [indexData ?? [], isLoadingIndex];

	const dataIsEmpty = !data ? true : Array.isArray(data) ? data.length === 0 : Object.keys(data).length === 0;

	return (
		<Section<Dashboard.TInterval, Dashboard.TIndex>
			id='market_view'
			title={t('home.market_view')}
			defaultTopActiveTab={defaultTab.top}
			defaultBottomActiveTab={defaultTab.bottom}
			onTopTabChange={(v) => setDefaultTabByPosition('top', v)}
			onBottomTabChange={(v) => setDefaultTabByPosition('bottom', v)}
			tabs={tabs}
		>
			<MarketViewChart interval={defaultTab.top} type={defaultTab.bottom} data={data as TIndexData} />
			<Suspend isLoading={isLoading} isEmpty={dataIsEmpty} />
		</Section>
	);
};

export default MarketView;
