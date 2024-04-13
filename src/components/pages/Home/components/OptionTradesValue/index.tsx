import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Section from '../../common/Section';

interface DefaultActiveTab {
	top: Dashboard.TInterval;
	bottom: Dashboard.GetOptionMarketComparison.TChartType;
}

const OptionTradesValue = () => {
	const t = useTranslations();

	const [defaultTab, setDefaultTab] = useState<DefaultActiveTab>({
		top: 'Today',
		bottom: 'OptionToMarket',
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
				// bottom: [
				// 	{ id: 'tab_value_process', title: t('home.tab_value_process') },
				// 	{ id: 'tab_put_option_relative_call', title: t('home.tab_put_option_relative_call') },
				// ],
			}}
		/>
	);
};

export default OptionTradesValue;
