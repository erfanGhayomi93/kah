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

	const columnDefs = useMemo<Array<IColDef<Dashboard.GetOptionSettlementInfo.Data>>>(
		() => [
			{
				headerName: t('home.symbol_title'),
				cellClass: 'cursor-pointer',
				onCellClick: (row) => setSymbol(row.symbolISIN),
				valueFormatter: (row) => row.symbolTitle,
			},
			{
				headerName: t(`home.${type === 'Closest' ? 'due_days' : 'passed_days'}`),
				valueFormatter: (row) =>
					'mostRecentPassedDays' in row
						? Math.max(row.mostRecentPassedDays ?? 0, 0)
						: Math.max(row.closestDueDays ?? 0, 0),
			},
			{
				headerName: t('home.today_value'),
				valueFormatter: (row) => numFormatter(row.totalTradeValue ?? 0),
			},
			{
				headerName: t('home.today_volume'),
				valueFormatter: (row) => numFormatter(row.totalTradeVolume ?? 0),
			},
		],
		[type],
	);

	if (isLoading) return <Loading />;

	if (!data?.length) return <NoData />;

	return <LightweightTable rowData={data} columnDefs={columnDefs} />;
};

export default DueDatesTable;
