import {
	useGetBaseTopSymbolsQuery,
	useGetOptionTopSymbolsQuery,
	useGetTopSymbolsQuery,
} from '@/api/queries/dashboardQueries';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { dateFormatter, sepNumbers, toFixed } from '@/utils/helpers';
import { useMemo } from 'react';

interface TableProps {
	symbolType: Dashboard.TTopSymbols;
	type: Dashboard.TTopSymbol;
}

const BestTable = ({ symbolType, type }: TableProps) => {
	const { data: optionTopSymbolsData, isFetching: isFetchingOptionTopSymbols } = useGetOptionTopSymbolsQuery({
		queryKey: ['getOptionTopSymbolsQuery', type as Dashboard.GetTopSymbols.Option.Type],
		enabled: symbolType === 'Option',
	});

	const { data: baseTopSymbolsData, isFetching: isFetchingBaseTopSymbolsData } = useGetBaseTopSymbolsQuery({
		queryKey: ['getBaseTopSymbolsQuery', type as Dashboard.GetTopSymbols.BaseSymbol.Type],
		enabled: symbolType === 'BaseSymbol',
	});

	const { data: topSymbolsData, isFetching: isFetchingTopSymbolsData } = useGetTopSymbolsQuery({
		queryKey: ['getTopSymbolsQuery', type as Dashboard.GetTopSymbols.Symbol.Type],
		enabled: symbolType === 'Symbol',
	});

	const getOptionValueColDefs = (): Array<IColDef<Dashboard.GetTopSymbols.Option.Value>> => [
		{
			headerName: 'نماد',
			valueFormatter: (row) => row.symbolTitle,
		},
		{
			headerName: 'ارزش',
			valueFormatter: (row) => sepNumbers(String(row.totalTradeValue ?? 0)),
		},
		{
			headerName: 'آخرین قیمت',
			valueFormatter: (row) => sepNumbers(String(row.lastTradedPrice ?? 0)),
		},
		{
			headerName: 'مانده تا سررسید (روز)',
			valueFormatter: (row) => row.dueDays,
		},
	];

	const getOptionOpenPositionsColDefs = (): Array<IColDef<Dashboard.GetTopSymbols.Option.OpenPosition>> => [
		{
			headerName: 'نماد',
			valueFormatter: (row) => row.symbolTitle,
		},
		{
			headerName: 'موقعیت باز',
			valueFormatter: (row) => sepNumbers(String(row.openPositionCount ?? 0)),
		},
		{
			headerName: 'مقدار (درصد تغییر)',
			cellClass: 'ltr',
			valueFormatter: (row) => `${toFixed(row.openPositionVarPercent)}%`,
		},
		{
			headerName: 'مانده تا سررسید (روز)',
			valueFormatter: (row) => row.dueDays,
		},
	];

	const getOptionTradesCountColDefs = (): Array<IColDef<Dashboard.GetTopSymbols.Option.TradeCount>> => [
		{
			headerName: 'نماد',
			valueFormatter: (row) => row.symbolTitle,
		},
		{
			headerName: 'تعداد معاملات',
			valueFormatter: (row) => sepNumbers(String(row.totalNumberOfTrades ?? 0)),
		},
		{
			headerName: 'درصد تغییر تعداد',
			cellClass: 'ltr',
			valueFormatter: (row) => `${toFixed(row.totalNumberOfTradesVarPercent)}%`,
		},
		{
			headerName: 'مانده تا سررسید (روز)',
			valueFormatter: (row) => row.dueDays,
		},
	];

	const getOptionYesterdayDiffColDefs = (): Array<IColDef<Dashboard.GetTopSymbols.Option.YesterdayDiff>> => [
		{
			headerName: 'نماد',
			valueFormatter: (row) => row.symbolTitle,
		},
		{
			headerName: 'درصد تغییر قیمت',
			cellClass: 'ltr',
			valueFormatter: (row) => `${toFixed(row.closingPriceVarReferencePricePercent)}%`,
		},
		{
			headerName: 'مقدار تغییر',
			valueFormatter: (row) => sepNumbers(String(row.closingPriceVarReferencePrice ?? 0)),
		},
		{
			headerName: 'مانده تا سررسید (روز)',
			valueFormatter: (row) => row.dueDays,
		},
	];

	const getOptionTradesVolumeColDefs = (): Array<IColDef<Dashboard.GetTopSymbols.Option.Volume>> => [
		{
			headerName: 'نماد',
			valueFormatter: (row) => row.symbolTitle,
		},
		{
			headerName: 'حجم معاملات',
			valueFormatter: (row) => sepNumbers(String(row.totalNumberOfSharesTraded ?? 0)),
		},
		{
			headerName: 'درصد تغییر حجم',
			cellClass: 'ltr',
			valueFormatter: (row) => `${toFixed(row.totalNumberOfSharesTradedVarPercent)}%`,
		},
		{
			headerName: 'مانده تا سررسید (روز)',
			valueFormatter: (row) => row.dueDays,
		},
	];

	const getBaseSymbolOpenCallPositionsColDefs = (): Array<
		IColDef<Dashboard.GetTopSymbols.BaseSymbol.CallOpenPosition>
	> => [
		{
			headerName: 'نماد',
			valueFormatter: (row) => row.baseSymbolTitle,
		},
		{
			headerName: 'تعداد موقعیت های باز خرید',
			valueFormatter: (row) => sepNumbers(String(0)),
		},
		{
			headerName: 'تغییر موقعیت های باز خرید',
			valueFormatter: (row) => sepNumbers(String(0)),
		},
		{
			headerName: 'تعداد قراردادهای دارای موقعیت باز خرید',
			valueFormatter: (row) => sepNumbers(String(0)),
		},
		{
			headerName: 'نزدیکترین سررسید',
			valueFormatter: (row) => dateFormatter(row.closestEndDate, 'date'),
		},
	];

	const getBaseSymbolOpenPutPositionsColDefs = (): Array<
		IColDef<Dashboard.GetTopSymbols.BaseSymbol.PutOpenPosition>
	> => [
		{
			headerName: 'نماد',
			valueFormatter: (row) => row.baseSymbolTitle,
		},
		{
			headerName: 'تعداد موقعیت های باز فروش',
			valueFormatter: (row) => sepNumbers(String(0)),
		},
		{
			headerName: 'تغییر موقعیت های باز فروش',
			valueFormatter: (row) => sepNumbers(String(0)),
		},
		{
			headerName: 'تعداد قراردادهای دارای موقعیت باز فروش',
			valueFormatter: (row) => sepNumbers(String(0)),
		},
		{
			headerName: 'نزدیکترین سررسید',
			valueFormatter: (row) => dateFormatter(row.closestEndDate, 'date'),
		},
	];

	const getBaseSymbolTradesVolumeColDefs = (): Array<IColDef<Dashboard.GetTopSymbols.BaseSymbol.Volume>> => [
		{
			headerName: 'نماد',
			valueFormatter: (row) => row.symbolTitle,
		},
		{
			headerName: 'حجم معاملات',
			valueFormatter: (row) => sepNumbers(String(row.totalNumberOfSharesTraded ?? 0)),
		},
		{
			headerName: 'میانگین حجم 30 روز',
			valueFormatter: (row) => sepNumbers(String(row.thirtyDayVolume)),
		},
		{
			headerName: 'میانگین حجم 90 روز',
			valueFormatter: (row) => sepNumbers(String(row.ninetyDayVolume)),
		},
		{
			headerName: 'آخرین قیمت با درصد',
			cellClass: 'ltr',
			valueFormatter: (row) => sepNumbers(String(row.lastTradedPrice ?? 0)),
		},
	];

	const getBaseSymbolTradesValueColDefs = (): Array<IColDef<Dashboard.GetTopSymbols.BaseSymbol.Value>> => [
		{
			headerName: 'نماد',
			valueFormatter: (row) => row.symbolTitle,
		},
		{
			headerName: 'ارزش معاملات',
			valueFormatter: (row) => sepNumbers(String(row.totalTradeValue ?? 0)),
		},
		{
			headerName: 'میانگین ارزش 30 روز',
			valueFormatter: (row) => sepNumbers(String(row.thirtyDayValue)),
		},
		{
			headerName: 'میانگین ارزش 90 روز',
			valueFormatter: (row) => sepNumbers(String(row.ninetyDayValue)),
		},
		{
			headerName: 'آخرین قیمت با درصد',
			cellClass: 'ltr',
			valueFormatter: (row) => sepNumbers(String(row.lastTradedPrice ?? 0)),
		},
	];

	const getBaseSymbolOpenPositionColDefs = (): Array<IColDef<Dashboard.GetTopSymbols.BaseSymbol.OpenPosition>> => [
		{
			headerName: 'نماد',
			valueFormatter: (row) => row.baseSymbolTitle,
		},
		{
			headerName: 'تعداد موقعیت باز',
			valueFormatter: (row) => sepNumbers(String(row.openPosition ?? 0)),
		},
		{
			headerName: 'تغییر موقعیت باز',
			valueFormatter: (row) => `${toFixed(row.openPositionVarPercent)}%`,
		},
		{
			headerName: 'تعداد قراردادهای دارای موقعیت باز',
			valueFormatter: (row) => sepNumbers(String(row.contractCount ?? 0)),
		},
		{
			headerName: 'نزدیکترین سررسید',
			valueFormatter: (row) => dateFormatter(row.closestEndDate, 'date'),
		},
	];

	const getSymbolTradesVolumeColDefs = (): Array<IColDef<Dashboard.GetTopSymbols.Symbol.Volume>> => [
		{
			headerName: 'نماد',
			valueFormatter: (row) => row.symbolTitle,
		},
		{
			headerName: 'حجم معاملات',
			valueFormatter: (row) => sepNumbers(String(row.totalNumberOfSharesTraded ?? 0)),
		},
		{
			headerName: 'میانگین حجم 30 روز',
			valueFormatter: (row) => sepNumbers(String(row.thirtyDayVolume)),
		},
		{
			headerName: 'میانگین حجم 90 روز',
			valueFormatter: (row) => sepNumbers(String(row.ninetyDayVolume)),
		},
		{
			headerName: 'آخرین قیمت با درصد',
			cellClass: 'ltr',
			valueFormatter: (row) => sepNumbers(String(row.lastTradedPrice ?? 0)),
		},
	];

	const getSymbolTradesValueColDefs = (): Array<IColDef<Dashboard.GetTopSymbols.Symbol.Value>> => [
		{
			headerName: 'نماد',
			valueFormatter: (row) => row.symbolTitle,
		},
		{
			headerName: 'ارزش معاملات',
			valueFormatter: (row) => sepNumbers(String(row.totalTradeValue ?? 0)),
		},
		{
			headerName: 'میانگین ارزش 30 روز',
			valueFormatter: (row) => sepNumbers(String(row.thirtyDayValue)),
		},
		{
			headerName: 'میانگین ارزش 90 روز',
			valueFormatter: (row) => sepNumbers(String(row.ninetyDayValue)),
		},
		{
			headerName: 'آخرین قیمت با درصد',
			cellClass: 'ltr',
			valueFormatter: (row) => sepNumbers(String(row.lastTradedPrice ?? 0)),
		},
	];

	const columnDefinitions = useMemo(() => {
		switch (type) {
			case 'OptionValue':
				return getOptionValueColDefs();
			case 'OptionOpenPosition':
				return getOptionOpenPositionsColDefs();
			case 'OptionTradeCount':
				return getOptionTradesCountColDefs();
			case 'OptionYesterdayDiff':
				return getOptionYesterdayDiffColDefs();
			case 'OptionVolume':
				return getOptionTradesVolumeColDefs();
			case 'BaseSymbolValue':
				return getBaseSymbolTradesValueColDefs();
			case 'BaseSymbolPutOpenPosition':
				return getBaseSymbolOpenPutPositionsColDefs();
			case 'BaseSymbolCallOpenPosition':
				return getBaseSymbolOpenCallPositionsColDefs();
			case 'BaseSymbolOpenPosition':
				return getBaseSymbolOpenPositionColDefs();
			case 'BaseSymbolVolume':
				return getBaseSymbolTradesVolumeColDefs();
			case 'SymbolValue':
				return getSymbolTradesValueColDefs();
			case 'SymbolVolume':
				return getSymbolTradesVolumeColDefs();
			default:
				return [];
		}
	}, [type]);

	const [data, isFetching]: [Dashboard.GetTopSymbols.AllAsArray, boolean] =
		symbolType === 'Option'
			? [optionTopSymbolsData ?? [], isFetchingOptionTopSymbols]
			: symbolType === 'BaseSymbol'
				? [baseTopSymbolsData ?? [], isFetchingBaseTopSymbolsData]
				: [topSymbolsData ?? [], isFetchingTopSymbolsData];

	return (
		<div className='relative h-full'>
			{isFetching ? (
				<Loading />
			) : data.length > 0 ? (
				<LightweightTable<Dashboard.GetTopSymbols.All>
					rowData={data}
					columnDefs={columnDefinitions as Array<IColDef<Dashboard.GetTopSymbols.All>>}
				/>
			) : (
				<NoData />
			)}
		</div>
	);
};

export default BestTable;
