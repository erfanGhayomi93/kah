import Loading from '@/components/common/Loading';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Section from '../../common/Section';

const OptionTradesValueChart = dynamic(() => import('./OptionTradesValueChart'), {
	loading: () => <Loading />,
});

interface IDefaultActiveTab {
	top: Dashboard.TInterval;
	bottom: Dashboard.GetOptionTradeProcess.TChartType;
}

const OptionTradesValue = () => {
	const t = useTranslations();

	const [defaultTab, setDefaultTab] = useState<IDefaultActiveTab>({
		top: 'Today',
		bottom: 'Process',
	});

	const setDefaultTabByPosition = <T extends keyof IDefaultActiveTab>(position: T, value: IDefaultActiveTab[T]) => {
		setDefaultTab((prev) => ({
			...prev,
			[position]: value,
		}));
	};

	return (
		<Section<IDefaultActiveTab['top'], IDefaultActiveTab['bottom']>
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
			<div className='relative flex-1 overflow-hidden py-8'>
				<OptionTradesValueChart interval={defaultTab.top} type={defaultTab.bottom} />
			</div>
		</Section>
	);
};

export default OptionTradesValue;
