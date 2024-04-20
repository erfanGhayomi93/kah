import { useGetTopOptionBaseSymbolValueQuery } from '@/api/queries/dashboardQueries';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { useAppDispatch } from '@/features/hooks';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface ITableData {
	today: Dashboard.GetTopOptionBaseSymbolValue.Symbol;
	week: Dashboard.GetTopOptionBaseSymbolValue.Symbol;
	month: Dashboard.GetTopOptionBaseSymbolValue.Symbol;
}

const TopBaseAssetsTable = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { data, isLoading } = useGetTopOptionBaseSymbolValueQuery({
		queryKey: ['getTopOptionBaseSymbolValueQuery'],
	});

	const setSymbol = (symbolISIN: string) => {
		dispatch(setSymbolInfoPanel(symbolISIN));
	};

	const dataMapper = useMemo(() => {
		const result: ITableData[] = [];

		if (!data) return result;

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

			return result.slice(0, 5);
		} catch (e) {
			return result.slice(0, 5);
		}
	}, [data]);

	const columnDefs = useMemo<Array<IColDef<ITableData>>>(
		() => [
			{
				headerName: t('home.daily'),
				cellClass: 'cursor-pointer',
				onCellClick: (row) => setSymbol(row.today.symbolISIN),
				valueFormatter: (row) => row.today.symbolTitle ?? '−',
			},
			{
				headerName: t('home.weekly'),
				cellClass: 'cursor-pointer',
				onCellClick: (row) => setSymbol(row.month.symbolISIN),
				valueFormatter: (row) => row.month.symbolTitle ?? '−',
			},
			{
				headerName: t('home.monthly'),
				cellClass: 'cursor-pointer',
				onCellClick: (row) => setSymbol(row.week.symbolISIN),
				valueFormatter: (row) => row.week.symbolTitle ?? '−',
			},
		],
		[],
	);

	if (isLoading) return <Loading />;

	if (
		!data ||
		Math.max(
			data.monthTopOptionBaseSymbolValues.length,
			data.todayTopOptionBaseSymbolValues.length,
			data.weekTopOptionBaseSymbolValues.length,
		) === 0
	)
		return <NoData />;

	return <LightweightTable rowData={dataMapper} columnDefs={columnDefs} />;
};

export default TopBaseAssetsTable;
