import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setCompareTransactionValueModal } from '@/features/slices/modalSlice';
import { type RootState } from '@/features/store';
import { createSelector } from '@reduxjs/toolkit';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Section from '../../common/Section';

const CompareTransactionValueChart = dynamic(() => import('./CompareTransactionValueChart'));

interface IDefaultActiveTab {
	top: Dashboard.TInterval;
	bottom: Dashboard.GetOptionMarketComparison.TChartType;
}

interface ICompareTransactionValueProps {
	isModal?: boolean;
}

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		getCompareTransactionValue: state.modal.compareTransactionValue,
	}),
);

const CompareTransactionValue = ({ isModal }: ICompareTransactionValueProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { getCompareTransactionValue } = useAppSelector(getStates);

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
			info={t('tooltip.compare_transaction_value_section')}
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
			expandable={!isModal}
			onExpand={() => dispatch(setCompareTransactionValueModal(getCompareTransactionValue ? null : {}))}
		>
			<CompareTransactionValueChart interval={defaultTab.top} type={defaultTab.bottom} />
		</Section>
	);
};

export default CompareTransactionValue;
