import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { dateFormatter } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface MeetingTableProps {
	data: Dashboard.GetAnnualReport.Data[];
}

const MeetingTable = ({ data }: MeetingTableProps) => {
	const t = useTranslations();

	const columnDefs = useMemo<Array<IColDef<Dashboard.GetAnnualReport.Data>>>(
		() => [
			{
				colId: 'symbolTitle',
				headerName: t('home.symbol_title'),
				valueFormatter: (row) => row.symbolTitle ?? '−',
			},
			{
				colId: 'date',
				headerName: t('home.date'),
				valueFormatter: (row) => dateFormatter(row.dateTime, 'date'),
			},
			{
				colId: 'title',
				headerName: t('home.title'),
				valueFormatter: (row) => row.title,
			},
		],
		[],
	);

	return <LightweightTable<Dashboard.GetAnnualReport.Data> rowData={data} columnDefs={columnDefs} />;
};

export default MeetingTable;
