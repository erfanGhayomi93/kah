import { useTranslations } from 'next-intl';
import { useLayoutEffect, useMemo, useState } from 'react';
import Section, { type ITab } from '../../common/Section';
import BestTable from './BestTable';

interface DefaultActiveTab {
	top: Dashboard.TTopSymbols;
	bottom: Dashboard.TTopSymbol;
}

const Best = () => {
	const t = useTranslations();

	const [defaultTab, setDefaultTab] = useState<DefaultActiveTab>({
		top: 'Option',
		bottom: 'OptionOpenPosition',
	});

	const setDefaultTabByPosition = <T extends keyof DefaultActiveTab>(position: T, value: DefaultActiveTab[T]) => {
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
			{ id: 'OptionOpenPosition', title: t('home.tab_option_position') },
			{ id: 'OptionTradeCount', title: t('home.tab_trades_count') },
			{ id: 'OptionYesterdayDiff', title: t('home.tab_changes_from_previous_day') },
			{ id: 'OptionVolume', title: t('home.tab_trades_volume') },
		];
	}, [defaultTab.top]);

	useLayoutEffect(() => {
		if (defaultTab.top === 'BaseSymbol') setDefaultTabByPosition('bottom', 'BaseSymbolCallOpenPosition');
		else if (defaultTab.top === 'Symbol') return setDefaultTabByPosition('bottom', 'SymbolVolume');
		else setDefaultTabByPosition('bottom', 'OptionOpenPosition');
	}, [defaultTab.top]);

	return (
		<Section<DefaultActiveTab['top'], DefaultActiveTab['bottom']>
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
			<div className='relative flex-1 overflow-hidden p-8'>
				<BestTable symbolType={defaultTab.top} type={defaultTab.bottom} />
			</div>
		</Section>
	);
};

export default Best;
