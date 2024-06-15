import { useGetFirstTradedOptionSymbolQuery, useGetMostTradedOptionSymbolQuery } from '@/api/queries/dashboardQueries';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { ChainSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import dayjs from '@/libs/dayjs';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface MeetingTableProps {
	type: Dashboard.TNewAndOld;
}

type TTableData = Dashboard.GetMostTradedOptionSymbol.Data | Dashboard.GetFirstTradedOptionSymbol.Data;

const NewAndOldTable = ({ type }: MeetingTableProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const fromNow = (v: string | number) => {
		return dayjs(v).calendar('jalali').locale('fa').fromNow();
	};

	const { data: mostTradedOptionSymbolData, isLoading: isLoadingMostTradedOptionSymbol } =
		useGetMostTradedOptionSymbolQuery({
			queryKey: ['getMostTradedOptionSymbolQuery'],
			enabled: type === 'MostTradedOptionSymbol',
		});

	const { data: firstTradedOptionSymbolData, isLoading: isLoadingFirstTradedOptionSymbol } =
		useGetFirstTradedOptionSymbolQuery({
			queryKey: ['getFirstTradedOptionSymbolQuery'],
			enabled: type === 'FirstTradedOptionSymbol',
		});

	const setSymbol = (symbolISIN: string) => {
		dispatch(setSymbolInfoPanel(symbolISIN));
	};

	const columnDefs = useMemo<Array<IColDef<TTableData>>>(
		() => [
			{
				colId: 'symbolISIN',
				headerName: t('home.symbol_title'),
				cellClass: 'cursor-pointer',
				onCellClick: (row) => setSymbol(row.symbolISIN),
				valueGetter: (row) => row.symbolTitle ?? '−',
			},
			{
				colId: 'contractEndDate',
				headerName: t('home.strike_date'),
				valueGetter: (row) => new Date(row.contractEndDate).getTime(),
				valueType: 'date',
			},
			{
				colId: 'workingDaysTradedCount',
				headerName: t(
					`home.${type === 'FirstTradedOptionSymbol' ? 'first_trade_date' : 'working_days_traded_count'}`,
				),
				valueGetter: (row) =>
					'firstTradeDate' in row
						? new Date(row.firstTradeDate).getTime()
						: String(row.workingDaysTradedCount),
				valueFormatter: ({ value }) => (typeof value === 'number' ? fromNow(value) : value),
			},
			{
				colId: 'detail',
				headerName: t('home.detail'),
				sortable: false,
				valueGetter: (row) => row.symbolISIN,
				valueFormatter: () => (
					<button type='button' className='text-light-gray-700 mx-auto flex-justify-center'>
						<ChainSVG width='2.4rem' height='2.4rem' />
					</button>
				),
			},
		],
		[type],
	);

	const [data, isLoading] =
		type === 'FirstTradedOptionSymbol'
			? [firstTradedOptionSymbolData ?? [], isLoadingFirstTradedOptionSymbol]
			: [mostTradedOptionSymbolData ?? [], isLoadingMostTradedOptionSymbol];

	if (isLoading) return <Loading />;

	if (!data?.length) return <NoData />;

	return (
		<LightweightTable
			headerClass='!text-tiny'
			rowHeight={40}
			headerHeight={40}
			rowData={data}
			columnDefs={columnDefs}
		/>
	);
};

export default NewAndOldTable;
