import { useGetOptionMarketComparisonQuery } from '@/api/queries/dashboardQueries';
import Loading from '@/components/common/Loading';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Section from '../../common/Section';
import CompareTransactionValueChart from './CompareTransactionValueChart';

interface DefaultActiveTab {
	top: Dashboard.TInterval;
	bottom: Dashboard.GetOptionMarketComparison.TChartType;
}

const CompareTransactionValue = () => {
	const t = useTranslations();

	const [defaultTab, setDefaultTab] = useState<DefaultActiveTab>({
		top: 'Today',
		bottom: 'OptionToMarket',
	});

	const { data, isFetching } = useGetOptionMarketComparisonQuery({
		queryKey: ['getOptionMarketComparisonQuery', defaultTab.top, defaultTab.bottom],
	});

	const setDefaultTabByPosition = <T extends keyof DefaultActiveTab>(position: T, value: DefaultActiveTab[T]) => {
		setDefaultTab((prev) => ({
			...prev,
			[position]: value,
		}));
	};

	return (
		<Section<DefaultActiveTab['top'], DefaultActiveTab['bottom']>
			id='compare_transaction_value'
			title={t('home.compare_transaction_value')}
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
					{ id: 'OptionToMarket', title: t('home.tab_option_relative_market') },
					{ id: 'OptionBuyToMarket', title: t('home.tab_call_market_option') },
					{ id: 'OptionSellToMarket', title: t('home.tab_put_market_option') },
				],
			}}
		>
			<div className='relative flex-1 overflow-hidden'>
				<CompareTransactionValueChart interval={defaultTab.top} data={data ?? {}} />

				{isFetching && (
					<div className='absolute size-full bg-white center'>
						<Loading />
					</div>
				)}
			</div>
		</Section>
	);
};

export default CompareTransactionValue;
