import { useBaseSettlementDaysQuery } from '@/api/queries/optionQueries';
import BaseSymbolSearch from '@/components/common/Symbol/BaseSymbolSearch';
import { SettlementItem } from '@/components/pages/OptionChain/Toolbar';
import { memo, useEffect } from 'react';

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
	const { data: settlementDays, isFetching } = useBaseSettlementDaysQuery({
		queryKey: ['baseSettlementDaysQuery', symbol ? symbol.symbolISIN : ''],
		enabled: symbol !== null,
	});

	useEffect(() => {
		if (!settlementDays) return;
		onSettlementDayChanged(settlementDays[0]);
	}, [JSON.stringify(settlementDays)]);

	return (
		<div className='gap-24 flex-items-center'>
			{!suppressBaseSymbolChange && (
				<div style={{ flex: '0 0 25.6rem' }}>
					<BaseSymbolSearch
						value={symbol}
						disabled={isPending}
						nullable={false}
						onChange={onBaseSymbolChange}
					/>
				</div>
			)}

			<div className='h-56 gap-8 overflow-hidden flex-items-center'>
				{isFetching ? (
					<>
						<div className='h-40 w-88 rounded skeleton' />
						<div className='h-40 w-88 rounded skeleton' />
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
