import { useGetIndexQuery } from '@/api/queries/dashboardQueries';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Section from '../../common/Section';
import MarketViewChart from './MarketViewChart';

const MarketView = () => {
	const t = useTranslations();

	const [tab, setTab] = useState<Dashboard.TIndexType>('Overall');

	const { data } = useGetIndexQuery({
		queryKey: ['getIndexQuery', tab],
	});

	return (
		<Section<string, Dashboard.TIndexType>
			id='market_view'
			title={t('home.market_view')}
			onBottomTabChange={setTab}
			tabs={{
				top: [
					{ id: 'tab_day', title: t('home.tab_day') },
					{ id: 'tab_week', title: t('home.tab_week') },
					{ id: 'tab_month', title: t('home.tab_month') },
					{ id: 'tab_3month', title: t('home.tab_3month') },
					{ id: 'tab_year', title: t('home.tab_year') },
				],
				bottom: [
					{ id: 'Overall', title: t('home.tab_overall_index') },
					{ id: 'EqualWeightOverall', title: t('home.tab_same_weight_index') },
					{ id: 'Overall', title: t('home.tab_small_trades_value') },
				],
			}}
		>
			<div className='flex-1 overflow-hidden'>
				<MarketViewChart data={data ?? null} />
			</div>
		</Section>
	);
};

export default MarketView;
