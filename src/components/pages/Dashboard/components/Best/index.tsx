import { useTranslations } from 'next-intl';
import { useLayoutEffect, useMemo, useState } from 'react';
import Section, { type ITab } from '../../common/Section';
import BestTable from './BestTable';

interface IDefaultActiveTab {
	top: Dashboard.TTopSymbols;
	bottom: Dashboard.TTopSymbol;
}

const Best = () => {
	const t = useTranslations();

	const [defaultTab, setDefaultTab] = useState<IDefaultActiveTab>({
		top: 'Option',
		bottom: 'OptionValue',
	});

	const setDefaultTabByPosition = <T extends keyof IDefaultActiveTab>(position: T, value: IDefaultActiveTab[T]) => {
		setDefaultTab((prev) => ({
			...prev,
			[position]: value,
		}));
	};

	const bottomTabs = useMemo<Array<ITab<Dashboard.TTopSymbol>>>(() => {
		if (defaultTab.top === 'BaseSymbol')
			return [
				{ id: 'BaseSymbolCallOpenPosition', title: t('home.tab_call_open_position') },
				{ id: 'BaseSymbolPutOpenPosition', title: t('home.tab_put_open_position') },
				{ id: 'BaseSymbolVolume', title: t('home.tab_trades_volume') },
				{ id: 'BaseSymbolValue', title: t('home.tab_trades_value') },
				{ id: 'BaseSymbolOpenPosition', title: t('home.tab_option_positions') },
			];

		if (defaultTab.top === 'Symbol')
			return [
				{ id: 'SymbolVolume', title: t('home.tab_trades_volume') },
				{ id: 'SymbolValue', title: t('home.tab_trades_value') },
			];

		return [
			{ id: 'OptionValue', title: t('home.tab_value') },
			{ id: 'OptionOpenPosition', title: t('home.tab_option_position') },
			{ id: 'OptionTradeCount', title: t('home.tab_trades_count') },
			{ id: 'OptionYesterdayDiff', title: t('home.tab_changes_from_previous_day') },
			{ id: 'OptionVolume', title: t('home.tab_trades_volume') },
		];
	}, [defaultTab.top]);

	useLayoutEffect(() => {
		if (defaultTab.top === 'BaseSymbol') setDefaultTabByPosition('bottom', 'BaseSymbolCallOpenPosition');
		else if (defaultTab.top === 'Symbol') return setDefaultTabByPosition('bottom', 'SymbolVolume');
		else setDefaultTabByPosition('bottom', 'OptionValue');
	}, [defaultTab.top]);

	return (
		<Section<IDefaultActiveTab['top'], IDefaultActiveTab['bottom']>
			id='best'
			title={t('home.best')}
			defaultTopActiveTab={defaultTab.top}
			defaultBottomActiveTab={defaultTab.bottom}
			onTopTabChange={(v) => setDefaultTabByPosition('top', v)}
			onBottomTabChange={(v) => setDefaultTabByPosition('bottom', v)}
			tabs={{
				top: [
					{ id: 'Option', title: t('home.tab_option') },
					{ id: 'BaseSymbol', title: t('home.tab_base_symbol') },
					{ id: 'Symbol', title: t('home.tab_symbol') },
				],
				bottom: bottomTabs,
			}}
		>
			<BestTable symbolType={defaultTab.top} type={defaultTab.bottom} />
		</Section>
	);
};

export default Best;
