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
				headerName: t('home.symbol_title'),
				cellClass: 'cursor-pointer',
				onCellClick: (row) => setSymbol(row.symbolISIN),
				valueFormatter: (row) => row.symbolTitle,
			},
			{
				headerName: t(`home.${type === 'Closest' ? 'due_days' : 'passed_days'}`),
				valueFormatter: (row) =>
					dateFormatter(
						'mostRecentPassedDays' in row
							? Math.max(row.mostRecentPassedDays ?? 0, 0)
							: Math.max(row.closestDueDays ?? 0, 0),
					),
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

	return <LightweightTable rowData={data.slice(0, 5)} columnDefs={columnDefs} />;
};

export default DueDatesTable;
