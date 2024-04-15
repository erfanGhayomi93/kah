import { useGetAnnualReportQuery } from '@/api/queries/dashboardQueries';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { dateFormatter } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface MeetingTableProps {
	type: Dashboard.GetAnnualReport.Type;
}

const MeetingTable = ({ type }: MeetingTableProps) => {
	const t = useTranslations();

	const { data, isFetching } = useGetAnnualReportQuery({
		queryKey: ['getAnnualReportQuery', type],
	});

	const columnDefs = useMemo<Array<IColDef<Dashboard.GetAnnualReport.Data>>>(
		() => [
			{
				headerName: t('home.symbol_title'),
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

	if (isFetching) return <Loading />;

	if (!data?.length) return <NoData />;

	return <LightweightTable<Dashboard.GetAnnualReport.Data> rowData={data ?? []} columnDefs={columnDefs} />;
};

export default MeetingTable;
