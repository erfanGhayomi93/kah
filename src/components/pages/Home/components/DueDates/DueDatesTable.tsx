import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { numFormatter } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface DueDatesTableProps {
	data: Dashboard.GetOptionSettlementInfo.Data[];
	type: Dashboard.GetOptionSettlementInfo.Type;
}

const DueDatesTable = ({ data, type }: DueDatesTableProps) => {
	const t = useTranslations();

	const columnDefs = useMemo<Array<IColDef<Dashboard.GetOptionSettlementInfo.Data>>>(
		() => [
			{
				colId: 'symbolTitle',
				headerName: t('home.symbol_title'),
				valueFormatter: (row) => row.symbolTitle,
			},
			{
				colId: 'days',
				headerName: t(`home.${type === 'Closest' ? 'due_days' : 'passed_days'}`),
				valueFormatter: (row) =>
					'mostRecentPassedDays' in row
						? Math.max(row.mostRecentPassedDays ?? 0, 0)
						: Math.max(row.closestDueDays ?? 0, 0),
			},
			{
				colId: 'totalTradeValue',
				headerName: t('home.today_value'),
				valueFormatter: (row) => numFormatter(row.totalTradeValue ?? 0),
			},
			{
				colId: 'totalTradeVolume',
				headerName: t('home.today_volume'),
				valueFormatter: (row) => numFormatter(row.totalTradeVolume ?? 0),
			},
		],
		[type],
	);

	return <LightweightTable<Dashboard.GetOptionSettlementInfo.Data> rowData={data} columnDefs={columnDefs} />;
};

export default DueDatesTable;
