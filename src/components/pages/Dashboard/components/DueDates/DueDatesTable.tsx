import { useGetOptionSettlementInfoQuery } from '@/api/queries/dashboardQueries';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { useAppDispatch } from '@/features/hooks';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { numFormatter } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface DueDatesTableProps {
	type: Dashboard.GetOptionSettlementInfo.Type;
}

const DueDatesTable = ({ type }: DueDatesTableProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const setSymbol = (symbolISIN: string) => {
		dispatch(setSymbolInfoPanel(symbolISIN));
	};

	const { data, isLoading } = useGetOptionSettlementInfoQuery({
		queryKey: ['getOptionSettlementInfoQuery', type],
	});

	const isMostRecentData = (
		row: Dashboard.GetOptionSettlementInfo.Data,
	): row is Dashboard.GetOptionSettlementInfo.MostRecentData => {
		return 'mostRecentPassedDays' in row;
	};

	const dateFormatter = (row: Dashboard.GetOptionSettlementInfo.Data) => {
		if (isMostRecentData(row)) {
			const v = row.mostRecentPassedDays;

			if (v === 0) return t('dates.today');

			if (v > 0) return t('home.days_ago', { v });

			return t('home.days_later', { v: Math.abs(v) });
		} else {
			const v = row.closestDueDays;

			if (v === 0) return t('dates.today');

			return Math.max(0, v);
		}
	};

	const columnDefs = useMemo<Array<IColDef<Dashboard.GetOptionSettlementInfo.Data>>>(
		() => [
			{
				colId: 'symbolISIN',
				headerName: t('home.symbol_title'),
				cellClass: 'cursor-pointer',
				onCellClick: (row) => setSymbol(row.symbolISIN),
				valueGetter: (row) => row.symbolTitle,
			},
			{
				colId: 'closestDueDays',
				headerName: t(`home.${type === 'Closest' ? 'due_days' : 'passed_days'}`),
				cellClass: 'rtl',
				valueGetter: (row) =>
					Math.abs('mostRecentPassedDays' in row ? row.mostRecentPassedDays ?? 0 : row.closestDueDays ?? 0),
				valueFormatter: ({ row }) => dateFormatter(row),
			},
			{
				colId: 'totalTradeValue',
				headerName: t('home.today_value'),
				valueGetter: (row) => row.totalTradeValue ?? 0,
				valueFormatter: ({ value }) => numFormatter(Number(value)),
			},
		],
		[type],
	);

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

export default DueDatesTable;
