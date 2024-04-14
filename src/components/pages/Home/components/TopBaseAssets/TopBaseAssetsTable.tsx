import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface TopBaseAssetsTableProps {
	data: Dashboard.GetTopOptionBaseSymbolValue.Data;
}

interface ITableData {
	today: Dashboard.GetTopOptionBaseSymbolValue.Symbol;
	week: Dashboard.GetTopOptionBaseSymbolValue.Symbol;
	month: Dashboard.GetTopOptionBaseSymbolValue.Symbol;
}

const TopBaseAssetsTable = ({ data }: TopBaseAssetsTableProps) => {
	const t = useTranslations();

	const dataMapper = useMemo(() => {
		const result: ITableData[] = [];

		try {
			const l = Math.max(
				data.todayTopOptionBaseSymbolValues.length,
				data.weekTopOptionBaseSymbolValues.length,
				data.monthTopOptionBaseSymbolValues.length,
			);

			if (l === 0) return result;

			for (let i = 0; i < l; i++) {
				result.push({
					today: data.todayTopOptionBaseSymbolValues[i] ?? {},
					week: data.monthTopOptionBaseSymbolValues[i] ?? {},
					month: data.weekTopOptionBaseSymbolValues[i] ?? {},
				});
			}

			return result;
		} catch (e) {
			return result;
		}
	}, [data]);

	const columnDefs = useMemo<Array<IColDef<ITableData>>>(
		() => [
			{
				colId: 'daily',
				headerName: t('home.daily'),
				valueFormatter: (row) => row.today?.symbolTitle ?? '−',
			},
			{
				colId: 'weekly',
				headerName: t('home.weekly'),
				valueFormatter: (row) => row.month?.symbolTitle ?? '−',
			},
			{
				colId: 'monthly',
				headerName: t('home.monthly'),
				valueFormatter: (row) => row.week?.symbolTitle ?? '−',
			},
		],
		[],
	);

	return <LightweightTable<ITableData> rowData={dataMapper} columnDefs={columnDefs} />;
};

export default TopBaseAssetsTable;
