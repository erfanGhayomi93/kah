import {
	useGetIndexDetailsQuery,
	useGetIndexQuery,
	useGetRetailTradeValuesQuery,
} from '@/api/queries/dashboardQueries';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setMarketViewModal } from '@/features/slices/modalSlice';
import { type RootState } from '@/features/store';
import { sepNumbers, toFixed } from '@/utils/helpers';
import { createSelector } from '@reduxjs/toolkit';
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

interface IMarketViewProps {
	isModal?: boolean;
}

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		getMarketView: state.modal.marketView,
	}),
);

const MarketView = ({ isModal = false }: IMarketViewProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { getMarketView } = useAppSelector(getStates);

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
								({'\u200E' + toFixed(indexDetails?.overallValuePercent ?? 0, 2)}%){' '}
								{' ' + sepNumbers((indexDetails?.overallValue ?? 0).toFixed(0))}
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
								({'\u200E' + toFixed(indexDetails?.equalWeightOverallPercent ?? 0, 2)}%)
								{' ' + sepNumbers((indexDetails?.equalWeightOverallValue ?? 0).toFixed(0))}
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
								({'\u200E' + toFixed(indexDetails?.retailTradesPercent ?? 0, 2)}%){' '}
								{' ' + sepNumbers((indexDetails?.retailTradesValue ?? 0).toFixed(0))}
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
			info={t('tooltip.market_view_section')}
			defaultTopActiveTab={defaultTab.top}
			defaultBottomActiveTab={defaultTab.bottom}
			onTopTabChange={(v) => setDefaultTabByPosition('top', v)}
			onBottomTabChange={(v) => setDefaultTabByPosition('bottom', v)}
			tabs={tabs}
			onExpand={() => dispatch(setMarketViewModal(getMarketView ? null : {}))}
			closeable={!isModal}
			expandable={!isModal}
		>
			<MarketViewChart interval={defaultTab.top} type={defaultTab.bottom} data={data as TIndexData} />
			<Suspend isLoading={isLoading} isEmpty={dataIsEmpty} />
		</Section>
	);
};

export default MarketView;
