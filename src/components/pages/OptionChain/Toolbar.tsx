import { useBaseSettlementDaysQuery } from '@/api/queries/optionQueries';
import BaseSymbolSearch from '@/components/common/Symbol/BaseSymbolSearch';
import { useAppDispatch } from '@/features/hooks';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import dayjs from '@/libs/dayjs';
import { sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';

interface SettlementItemProps {
	settlementDay: Option.BaseSettlementDays;
	activeSettlementDay: Option.BaseSettlementDays | null;
	setSettlementDay: (item: Option.BaseSettlementDays) => void;
}

interface ToolbarProps {
	inputs: OptionChainFilters;
	setFieldValue: <T extends keyof OptionChainFilters>(name: T, value: OptionChainFilters[T]) => void;
}

const Toolbar = ({ inputs, setFieldValue }: ToolbarProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { data: settlementDays, isFetching } = useBaseSettlementDaysQuery({
		queryKey: ['baseSettlementDaysQuery', inputs.baseSymbol?.symbolISIN ?? null],
		enabled: Boolean(inputs.baseSymbol),
	});

	const openSymbolInfo = () => {
		if (inputs.baseSymbol) dispatch(setSymbolInfoPanel(inputs.baseSymbol.symbolISIN));
	};

	const totalOpenPositionCount = useMemo(() => {
		if (!Array.isArray(settlementDays)) return 0;
		return settlementDays.reduce((total, current) => total + current.openPosition, 0);
	}, [settlementDays]);

	useEffect(() => {
		if (Array.isArray(settlementDays)) setFieldValue('settlementDay', settlementDays[0]);
	}, [settlementDays, inputs.baseSymbol]);

	return (
		<div
			style={{ flex: '0 0 5.6rem' }}
			className='darkBlue:bg-gray-50 gap-36 rounded bg-white px-16 flex-justify-between dark:bg-gray-50'
		>
			<div className='flex-1 gap-24 flex-items-center'>
				<div style={{ flex: '0 0 25.6rem' }}>
					<BaseSymbolSearch
						nullable={false}
						value={inputs.baseSymbol}
						onChange={(symbol) => setFieldValue('baseSymbol', symbol)}
					/>
				</div>

				<div className='h-56 gap-8 overflow-hidden flex-items-center'>
					{isFetching ? (
						<>
							<div className='h-40 w-88 rounded skeleton' />
							<div className='h-40 w-88 rounded skeleton' />
						</>
					) : (
						<ul className='flex gap-8 overflow-auto'>
							{settlementDays?.map((item, i) => (
								<SettlementItem
									key={i}
									activeSettlementDay={inputs.settlementDay}
									settlementDay={item}
									setSettlementDay={(v) => setFieldValue('settlementDay', v)}
								/>
							))}
						</ul>
					)}
				</div>
			</div>

			{Boolean(inputs.baseSymbol) && (
				<div className='gap-8 flex-items-center'>
					<div className='h-40 rounded bg-gray-100 px-8 flex-items-center'>
						<span className='gap-8 whitespace-nowrap text-base text-gray-700 flex-items-center'>
							{t('option_chain.total_open_contracts')}:
							<span className='font-medium text-gray-800'>
								{sepNumbers(String(totalOpenPositionCount))}
							</span>
						</span>
					</div>

					<button type='button' onClick={openSymbolInfo} className='h-40 rounded px-16 btn-info-outline'>
						{t('option_chain.base_symbol_info')}
					</button>
				</div>
			)}
		</div>
	);
};

export const SettlementItem = ({ activeSettlementDay, settlementDay, setSettlementDay }: SettlementItemProps) => {
	const dateFormatter = (v: string) => {
		const d = dayjs(v).calendar('jalali');
		if (!d.isValid()) return '−';

		return d.locale('fa').format('DD MMMM');
	};

	return (
		<li>
			<button
				onClick={() => setSettlementDay(settlementDay)}
				type='button'
				className={clsx(
					'h-40 w-88 rounded !border transition-colors',
					settlementDay?.contractEndDate === activeSettlementDay?.contractEndDate
						? 'no-hover font-medium btn-select'
						: 'border-gray-200 text-gray-700 hover:btn-hover',
				)}
			>
				{dateFormatter(settlementDay.contractEndDate)}
			</button>
		</li>
	);
};

export default Toolbar;
