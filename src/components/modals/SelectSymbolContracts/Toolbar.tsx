import { useBaseSettlementDaysQuery } from '@/api/queries/optionQueries';
import BaseSymbolSearch from '@/components/common/Symbol/BaseSymbolSearch';
import { SettlementItem } from '@/components/pages/OptionChain/Toolbar';
import { memo, useEffect, useState } from 'react';

interface SettlementDaysProps {
	data: Option.BaseSettlementDays[];
	activeSettlementDay: Option.BaseSettlementDays | null;
	onSelect: (item: Option.BaseSettlementDays) => void;
}

interface ToolbarProps {
	suppressBaseSymbolChange: boolean;
	settlementDay: Option.BaseSettlementDays | null;
	symbol: Option.BaseSearch | null;
	isPending: boolean;
	onBaseSymbolChange: (v: Option.BaseSearch | null) => void;
	onSettlementDayChanged: (item: Option.BaseSettlementDays) => void;
}

const Toolbar = ({
	symbol,
	settlementDay,
	suppressBaseSymbolChange,
	isPending,
	onBaseSymbolChange,
	onSettlementDayChanged,
}: ToolbarProps) => {
	const [baseSymbol, setBaseSymbol] = useState<Option.BaseSearch | null>(symbol);

	const { data: settlementDays, isFetching } = useBaseSettlementDaysQuery({
		queryKey: ['baseSettlementDaysQuery', baseSymbol ? baseSymbol.symbolISIN : ''],
		enabled: baseSymbol !== null,
	});

	useEffect(() => {
		if (!settlementDays) return;
		onSettlementDayChanged(settlementDays[0]);
	}, [JSON.stringify(settlementDays)]);

	useEffect(() => {
		setBaseSymbol(symbol);
	}, [symbol]);

	return (
		<div className='gap-24 flex-items-center'>
			{!suppressBaseSymbolChange && (
				<div style={{ flex: '0 0 25.6rem' }}>
					<BaseSymbolSearch
						value={baseSymbol}
						disabled={isPending}
						nullable={false}
						onChange={(symbol) => {
							setBaseSymbol(symbol);
							onBaseSymbolChange(symbol);
						}}
					/>
				</div>
			)}

			<div className='h-56 gap-8 overflow-hidden flex-items-center'>
				{isFetching ? (
					<>
						<div className='skeleton h-40 w-88 rounded' />
						<div className='skeleton h-40 w-88 rounded' />
					</>
				) : (
					<SettlementDays
						data={settlementDays ?? []}
						activeSettlementDay={settlementDay}
						onSelect={onSettlementDayChanged}
					/>
				)}
			</div>
		</div>
	);
};

const SettlementDays = memo(
	({ data, activeSettlementDay, onSelect }: SettlementDaysProps) => (
		<ul className='flex gap-8 overflow-auto'>
			{data.map((item, i) => (
				<SettlementItem
					key={item.contractEndDate}
					activeSettlementDay={activeSettlementDay}
					settlementDay={item}
					setSettlementDay={() => onSelect(item)}
				/>
			))}
		</ul>
	),
	(prev, next) =>
		prev.activeSettlementDay?.contractEndDate === next.activeSettlementDay?.contractEndDate &&
		JSON.stringify(prev) === JSON.stringify(next),
);

export default memo(
	Toolbar,
	(prev, next) =>
		prev.symbol?.symbolISIN === next.symbol?.symbolISIN &&
		prev.isPending === next.isPending &&
		prev.settlementDay?.contractEndDate === next.settlementDay?.contractEndDate,
);
