import { useBaseSettlementDaysQuery } from '@/api/queries/optionQueries';
import BaseSymbolSearch from '@/components/common/Symbol/BaseSymbolSearch';
import { SettlementItem } from '@/components/pages/OptionChain/Toolbar';
import { useEffect, useState } from 'react';

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
	const [baseSymbol, setBaseSymbol] = useState<Option.BaseSearch | null>(
		!symbol
			? null
			: {
					symbolISIN: symbol.symbolISIN,
					symbolTitle: symbol.symbolTitle,
					insCode: '0',
					companyISIN: '0',
					companyName: '−',
					symbolTradeState: 'Open',
				},
	);

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
						value={baseSymbol}
						onChange={(symbol) => {
							setBaseSymbol(symbol);
							onBaseSymbolChange(symbol);
						}}
						disabled={isPending}
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
					<ul className='flex gap-8 overflow-auto'>
						{settlementDays?.map((item, i) => (
							<SettlementItem
								key={i}
								activeSettlementDay={settlementDay}
								settlementDay={item}
								setSettlementDay={onSettlementDayChanged}
							/>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default Toolbar;
