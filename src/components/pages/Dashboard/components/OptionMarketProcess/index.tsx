import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Section from '../../common/Section';

const OptionMarketProcessChart = dynamic(() => import('./OptionMarketProcessChart'));

interface IDefaultActiveTab {
	top: Dashboard.TInterval;
	bottom: Dashboard.GetMarketProcessChart.TChartType;
}

const OptionMarketProcess = () => {
	const t = useTranslations();

	const [defaultTab, setDefaultTab] = useState<IDefaultActiveTab>({
		top: 'Today',
		bottom: 'Volume',
	});

	const setDefaultTabByPosition = <T extends keyof IDefaultActiveTab>(position: T, value: IDefaultActiveTab[T]) => {
		setDefaultTab((prev) => ({
			...prev,
			[position]: value,
		}));
	};

	return (
		<Section<IDefaultActiveTab['top'], IDefaultActiveTab['bottom']>
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
			<OptionMarketProcessChart interval={defaultTab.top} type={defaultTab.bottom} />
		</Section>
	);
};

export default OptionMarketProcess;
