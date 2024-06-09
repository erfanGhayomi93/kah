import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setOptionTradeValueModal } from '@/features/slices/modalSlice';
import { type RootState } from '@/features/store';
import { createSelector } from '@reduxjs/toolkit';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Section from '../../common/Section';

const OptionTradesValueChart = dynamic(() => import('./OptionTradesValueChart'));

interface IDefaultActiveTab {
	top: Dashboard.TInterval;
	bottom: Dashboard.GetOptionTradeProcess.TChartType;
}

interface IOptionTradesValueModalProps {
	isModal?: boolean;
}

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		getOptionTradeValue: state.modal.optionTradeValue,
	}),
);

const OptionTradesValueModal = ({ isModal }: IOptionTradesValueModalProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { getOptionTradeValue } = useAppSelector(getStates);

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
			info={t('tooltip.option_trade_value_section')}
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
			closeable={!isModal}
			expandable={!isModal}
			onExpand={() => dispatch(setOptionTradeValueModal(getOptionTradeValue ? null : {}))}
		>
			<OptionTradesValueChart interval={defaultTab.top} type={defaultTab.bottom} />
		</Section>
	);
};

export default OptionTradesValueModal;
