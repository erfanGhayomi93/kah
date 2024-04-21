import { useBaseSettlementDaysQuery } from '@/api/queries/optionQueries';
import BaseSymbolSearch from '@/components/common/Symbol/BaseSymbolSearch';
import { SettlementItem } from '@/components/pages/OptionChain/Toolbar';
import { useEffect, useState } from 'react';

interface ToolbarProps {
	canChangeBaseSymbol: boolean;
	symbolISIN: string;
	settlementDay: Option.BaseSettlementDays | null;
	setSettlementDay: (item: Option.BaseSettlementDays) => void;
}

const Toolbar = ({ symbolISIN, settlementDay, canChangeBaseSymbol, setSettlementDay }: ToolbarProps) => {
	const [baseSymbol, setBaseSymbol] = useState<Option.BaseSearch | null>(null);

	const { data: settlementDays, isFetching } = useBaseSettlementDaysQuery({
		queryKey: ['baseSettlementDaysQuery', symbolISIN],
	});

	useEffect(() => {
		if (!settlementDays) return;
		setSettlementDay(settlementDays[0]);
	}, [JSON.stringify(settlementDays)]);

	return (
		<div className='gap-24 overflow-hidden flex-items-center'>
			{canChangeBaseSymbol && (
				<div style={{ flex: '0 0 25.6rem' }}>
					<BaseSymbolSearch value={baseSymbol} onChange={(symbol) => setBaseSymbol(symbol)} />
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
								setSettlementDay={setSettlementDay}
							/>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default Toolbar;
