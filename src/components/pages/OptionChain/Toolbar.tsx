import { useBaseSettlementDaysQuery } from '@/api/queries/optionQueries';
import OptionWatchlistManagerBtn from '@/components/common/Buttons/OptionWatchlistManagerBtn';
import BaseSymbolSearch from '@/components/common/Symbol/BaseSymbolSearch';
import Tooltip from '@/components/common/Tooltip';
import { initialColumnsOptionChain } from '@/constants/columns';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getOptionChainColumns, setOptionChainColumns } from '@/features/slices/columnSlice';
import { setManageColumnsModal } from '@/features/slices/modalSlice';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import dayjs from '@/libs/dayjs';
import { persianNumFormatter, sepNumbers } from '@/utils/helpers';
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

	const optionChainColumns = useAppSelector(getOptionChainColumns);

	const { data: settlementDays, isFetching } = useBaseSettlementDaysQuery({
		queryKey: ['baseSettlementDaysQuery', inputs.baseSymbol?.symbolISIN ?? null],
		enabled: Boolean(inputs.baseSymbol),
	});

	const openSymbolInfo = () => {
		if (inputs.baseSymbol) dispatch(setSymbolInfoPanel(inputs.baseSymbol.symbolISIN));
	};

	const [totalOpenPositionCount, totalValue] = useMemo(() => {
		if (!Array.isArray(settlementDays)) return [0, 0];
		return settlementDays.reduce(
			(total, current) => [total[0] + current.openPosition, total[1] + current.tradeValue],
			[0, 0],
		);
	}, [settlementDays]);

	const manageColumns = () => {
		dispatch(
			setManageColumnsModal({
				initialColumns: initialColumnsOptionChain,
				columns: optionChainColumns,
				title: t('option_chain.manage_columns'),
				onColumnsChanged: (columns) => dispatch(setOptionChainColumns(columns)),
				onReset: () => dispatch(setOptionChainColumns(initialColumnsOptionChain)),
			}),
		);
	};

	useEffect(() => {
		if (Array.isArray(settlementDays)) setFieldValue('settlementDay', settlementDays[0]);
	}, [settlementDays, inputs.baseSymbol]);

	return (
		<div
			style={{ flex: '0 0 5.6rem' }}
			className='gap-36 rounded bg-white px-16 flex-justify-between darkBlue:bg-gray-50 dark:bg-gray-50'
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

			<div className='gap-8 flex-items-center'>
				{Boolean(inputs.baseSymbol) && (
					<>
						<div className='h-40 gap-24 rounded bg-gray-100 px-8 flex-items-center'>
							<span className='gap-8 whitespace-nowrap text-base text-gray-700 flex-items-center'>
								{t('option_chain.total_open_contracts') + ' ' + inputs.baseSymbol?.symbolTitle}:
								<span className='font-medium text-gray-800'>
									{sepNumbers(String(totalOpenPositionCount))}
								</span>
							</span>

							<span className='gap-8 whitespace-nowrap text-base text-gray-700 flex-items-center'>
								{t('option_chain.value')}:
								<span className='font-medium text-gray-800'>{persianNumFormatter(totalValue)}</span>
								{totalValue > 0 && t('common.rial')}
							</span>
						</div>

						<button type='button' onClick={openSymbolInfo} className='h-40 rounded px-16 btn-info-outline'>
							{t('option_chain.base_symbol_info')}
						</button>
					</>
				)}
				<Tooltip placement='bottom' content={t('option_chain.manage_columns_tooltip')}>
					<OptionWatchlistManagerBtn onClick={manageColumns} />
				</Tooltip>
			</div>
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
