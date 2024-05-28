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

	const dateFormatter = (v: number): number | string => {
		if (v === 0) return t('validity_date.Today');

		if (v === 1) return t('validity_date.Tomorrow');

		return v;
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
				valueGetter: (row) =>
					'mostRecentPassedDays' in row ? row.mostRecentPassedDays ?? 0 : row.closestDueDays ?? 0,
				valueFormatter: ({ value }) => dateFormatter(Number(value)),
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

	return <LightweightTable rowHeight={40} headerHeight={40} rowData={data} columnDefs={columnDefs} />;
};

export default DueDatesTable;
