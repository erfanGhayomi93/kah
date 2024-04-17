import Loading from '@/components/common/Loading';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Section from '../../common/Section';

const CompareTransactionValueChart = dynamic(() => import('./CompareTransactionValueChart'), {
	loading: () => <Loading />,
});

interface IDefaultActiveTab {
	top: Dashboard.TInterval;
	bottom: Dashboard.GetOptionMarketComparison.TChartType;
}

const CompareTransactionValue = () => {
	const t = useTranslations();

	const [defaultTab, setDefaultTab] = useState<IDefaultActiveTab>({
		top: 'Today',
		bottom: 'OptionToMarket',
	});

	const setDefaultTabByPosition = <T extends keyof IDefaultActiveTab>(position: T, value: IDefaultActiveTab[T]) => {
		setDefaultTab((prev) => ({
			...prev,
			[position]: value,
		}));
	};

	return (
		<Section<IDefaultActiveTab['top'], IDefaultActiveTab['bottom']>
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
			<CompareTransactionValueChart interval={defaultTab.top} type={defaultTab.bottom} />
		</Section>
	);
};

export default CompareTransactionValue;
