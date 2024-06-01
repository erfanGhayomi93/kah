import { useGetAnnualReportQuery } from '@/api/queries/dashboardQueries';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { useAppDispatch } from '@/features/hooks';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface MeetingTableProps {
	type: Dashboard.GetAnnualReport.Type;
}

const MeetingTable = ({ type }: MeetingTableProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { data, isLoading } = useGetAnnualReportQuery({
		queryKey: ['getAnnualReportQuery', type],
	});

	const setSymbol = (symbolISIN: string) => {
		dispatch(setSymbolInfoPanel(symbolISIN));
	};

	const columnDefs = useMemo<Array<IColDef<Dashboard.GetAnnualReport.Data>>>(
		() => [
			{
				colId: 'symbol_title',
				headerName: t('home.symbol_title'),
				cellClass: 'cursor-pointer',
				onCellClick: (row) => setSymbol(row.symbolISIN),
				valueGetter: (row) => row.symbolTitle ?? '−',
			},
			{
				colId: 'date',
				headerName: t('home.date'),
				valueGetter: (row) => new Date(row.dateTime).getTime(),
				valueType: 'date',
			},
			{
				colId: 'title',
				headerName: t('home.title'),
				valueGetter: (row) => row.title,
			},
		],
		[],
	);

	if (isLoading) return <Loading />;

	if (!data?.length) return <NoData />;

	return <LightweightTable rowHeight={40} headerHeight={40} rowData={data} columnDefs={columnDefs} />;
};

export default MeetingTable;
