import { useGetFirstTradedOptionSymbolQuery, useGetMostTradedOptionSymbolQuery } from '@/api/queries/dashboardQueries';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { ChainSVG } from '@/components/icons';
import dayjs from '@/libs/dayjs';
import { dateFormatter } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

interface MeetingTableProps {
	type: Dashboard.TNewAndOld;
}

type TTableData = Dashboard.GetMostTradedOptionSymbol.Data | Dashboard.GetFirstTradedOptionSymbol.Data;

const NewAndOldTable = ({ type }: MeetingTableProps) => {
	const t = useTranslations();

	const fromNow = (v: string) => {
		return dayjs(v).calendar('jalali').locale('fa').fromNow();
	};

	const { data: mostTradedOptionSymbolData, isLoading: isLoadingMostTradedOptionSymbol } =
		useGetMostTradedOptionSymbolQuery({
			queryKey: ['getMostTradedOptionSymbolQuery'],
			enabled: type === 'MostTradedOptionSymbol',
		});

	const { data: firstTradedOptionSymbolData, isLoading: isLoadingFirstTradedOptionSymbol } =
		useGetFirstTradedOptionSymbolQuery({
			queryKey: ['getFirstTradedOptionSymbolQuery'],
			enabled: type === 'FirstTradedOptionSymbol',
		});

	const columnDefs = useMemo<Array<IColDef<TTableData>>>(
		() => [
			{
				headerName: t('home.symbol_title'),
				valueFormatter: (row) => row.symbolTitle ?? '−',
			},
			{
				headerName: t('home.strike_date'),
				valueFormatter: (row) => dateFormatter(row.contractEndDate, 'date'),
			},
			{
				headerName: t(
					`home.${type === 'FirstTradedOptionSymbol' ? 'first_trade_date' : 'working_days_traded_count'}`,
				),
				valueFormatter: (row) =>
					'firstTradeDate' in row ? fromNow(row.firstTradeDate) : row.workingDaysTradedCount,
			},
			{
				headerName: t('home.detail'),
				valueFormatter: () => (
					<button type='button' className='mx-auto text-gray-900 flex-justify-center'>
						<ChainSVG width='2.4rem' height='2.4rem' />
					</button>
				),
			},
		],
		[type],
	);

	const [data, isLoading] =
		type === 'FirstTradedOptionSymbol'
			? [firstTradedOptionSymbolData ?? [], isLoadingFirstTradedOptionSymbol]
			: [mostTradedOptionSymbolData ?? [], isLoadingMostTradedOptionSymbol];

	if (isLoading) return <Loading />;

	if (!data?.length) return <NoData />;

	return <LightweightTable<TTableData> rowData={data} columnDefs={columnDefs} />;
};

export default NewAndOldTable;
