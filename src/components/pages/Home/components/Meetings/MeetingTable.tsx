import { useGetAnnualReportQuery } from '@/api/queries/dashboardQueries';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { useAppDispatch } from '@/features/hooks';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { dateFormatter } from '@/utils/helpers';
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
				headerName: t('home.symbol_title'),
				cellClass: 'cursor-pointer',
				onCellClick: (row) => setSymbol(row.symbolISIN),
				valueFormatter: (row) => row.symbolTitle ?? '−',
			},
			{
				headerName: t('home.date'),
				valueFormatter: (row) => dateFormatter(row.dateTime, 'date'),
			},
			{
				headerName: t('home.title'),
				valueFormatter: (row) => row.title,
			},
		],
		[],
	);

	if (isLoading) return <Loading />;

	if (!data?.length) return <NoData />;

	return <LightweightTable rowData={data.slice(0, 5)} columnDefs={columnDefs} />;
};

export default MeetingTable;
