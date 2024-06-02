import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setOptionMarketProcessModal } from '@/features/slices/modalSlice';
import { type RootState } from '@/features/store';
import { createSelector } from '@reduxjs/toolkit';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Section from '../../common/Section';

const OptionMarketProcessChart = dynamic(() => import('./OptionMarketProcessChart'));

interface IDefaultActiveTab {
	top: Dashboard.TInterval;
	bottom: Dashboard.GetMarketProcessChart.TChartType;
}

interface IOptionMarketProcessProps {
	isModal?: boolean;
}

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		getOptionMarketProcess: state.modal.optionMarketProcess,
	}),
);

const OptionMarketProcess = ({ isModal = false }: IOptionMarketProcessProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { getOptionMarketProcess } = useAppSelector(getStates);

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
			info={t('tooltip.option_market_process_section')}
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
			closeable={!isModal}
			expandable={!isModal}
			onExpand={() => dispatch(setOptionMarketProcessModal(getOptionMarketProcess ? null : {}))}
		>
			<OptionMarketProcessChart interval={defaultTab.top} type={defaultTab.bottom} />
		</Section>
	);
};

export default OptionMarketProcess;
