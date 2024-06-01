import {
	useGetBaseTopSymbolsQuery,
	useGetOptionTopSymbolsQuery,
	useGetTopSymbolsQuery,
} from '@/api/queries/dashboardQueries';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { useAppDispatch } from '@/features/hooks';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { dateFormatter, getColorBasedOnPercent, toFixed } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';

interface TableProps {
	symbolType: Dashboard.TTopSymbols;
	type: Dashboard.TTopSymbol;
}

interface TableWrapperProps {
	type: TOptionSides;
	title: string;
	isOption: boolean;
	children: React.ReactNode;
}

interface ValuePercentProps {
	value: number;
	percent: number;
}

type TCol = Array<IColDef<Record<TOptionSides, Dashboard.GetTopSymbols.Option.All>>>;

const BestTable = ({ symbolType, type }: TableProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const { data: optionTopSymbolsData, isLoading: isLoadingOptionTopSymbols } = useGetOptionTopSymbolsQuery({
		queryKey: ['getOptionTopSymbolsQuery', type as Dashboard.GetTopSymbols.Option.Type],
		enabled: symbolType === 'Option',
	});

	const { data: baseTopSymbolsData, isLoading: isLoadingBaseTopSymbolsData } = useGetBaseTopSymbolsQuery({
		queryKey: ['getBaseTopSymbolsQuery', type as Dashboard.GetTopSymbols.BaseSymbol.Type],
		enabled: symbolType === 'BaseSymbol',
	});

	const { data: topSymbolsData, isLoading: isLoadingTopSymbolsData } = useGetTopSymbolsQuery({
		queryKey: ['getTopSymbolsQuery', type as Dashboard.GetTopSymbols.Symbol.Type],
		enabled: symbolType === 'Symbol',
	});

	const setSymbol = (symbolISIN: string) => {
		dispatch(setSymbolInfoPanel(symbolISIN));
	};

	const getOptionValueColDefs = (
		side: TOptionSides,
	): Array<IColDef<Record<TOptionSides, Dashboard.GetTopSymbols.Option.Value>>> => [
		{
			colId: 'symbolISIN',
			headerName: 'نماد',
			cellClass: 'cursor-pointer font-medium',
			onCellClick: (row) => setSymbol(row[side]?.symbolISIN),
			valueGetter: (row) => row[side]?.symbolTitle ?? '−',
		},
		{
			colId: 'totalTradeValue',
			headerName: 'ارزش',
			valueGetter: (row) => row[side]?.totalTradeValue ?? 0,
			valueType: 'separate',
		},
		{
			colId: 'lastTradedPrice',
			headerName: 'آخرین قیمت',
			valueGetter: (row) => row[side]?.lastTradedPrice ?? 0,
			valueType: 'separate',
		},
		{
			colId: 'dueDays',
			headerName: 'مانده تا سررسید (روز)',
			valueGetter: (row) => row[side]?.dueDays ?? 0,
			valueType: 'separate',
		},
	];

	const getOptionOpenPositionsColDefs = (
		side: TOptionSides,
	): Array<IColDef<Record<TOptionSides, Dashboard.GetTopSymbols.Option.OpenPosition>>> => [
		{
			colId: 'symbolISIN',
			headerName: 'نماد',
			cellClass: 'cursor-pointer font-medium',
			onCellClick: (row) => setSymbol(row[side]?.symbolISIN),
			valueGetter: (row) => row[side]?.symbolTitle ?? '−',
		},
		{
			colId: 'openPositionCount',
			headerName: 'موقعیت باز',
			valueGetter: (row) => row[side]?.openPositionCount ?? 0,
			valueType: 'separate',
		},
		{
			colId: 'openPositionCountDiff',
			headerName: 'مقدار (درصد تغییر)',
			cellClass: 'ltr',
			valueGetter: (row) => row[side]?.openPositionCountDiff ?? 0,
			valueFormatter: ({ row }) => {
				const { openPositionVarPercent, openPositionCountDiff } = row[side];
				return <ValuePercent value={openPositionCountDiff} percent={openPositionVarPercent} />;
			},
		},
		{
			colId: 'dueDays',
			headerName: 'مانده تا سررسید (روز)',
			valueGetter: (row) => row[side]?.dueDays ?? 0,
			valueType: 'separate',
		},
	];

	const getOptionTradesCountColDefs = (
		side: TOptionSides,
	): Array<IColDef<Record<TOptionSides, Dashboard.GetTopSymbols.Option.TradeCount>>> => [
		{
			colId: 'symbolISIN',
			headerName: 'نماد',
			cellClass: 'cursor-pointer font-medium',
			onCellClick: (row) => setSymbol(row[side]?.symbolISIN),
			valueGetter: (row) => row[side]?.symbolTitle ?? '−',
		},
		{
			colId: 'totalNumberOfTrades',
			headerName: 'تعداد معاملات',
			valueGetter: (row) => row[side]?.totalNumberOfTrades ?? 0,
			valueType: 'separate',
		},
		{
			colId: 'totalNumberOfTradesVarPercent',
			headerName: 'درصد تغییر تعداد',
			cellClass: (row) => ['ltr', getColorBasedOnPercent(row[side]?.totalNumberOfTradesVarPercent)],
			valueGetter: (row) => row[side]?.totalNumberOfTradesVarPercent ?? 0,
			valueType: 'percent',
		},
		{
			colId: 'dueDays',
			headerName: 'مانده تا سررسید (روز)',
			valueGetter: (row) => row[side]?.dueDays ?? 0,
			valueType: 'separate',
		},
	];

	const getOptionYesterdayDiffColDefs = (
		side: TOptionSides,
	): Array<IColDef<Record<TOptionSides, Dashboard.GetTopSymbols.Option.YesterdayDiff>>> => [
		{
			colId: 'symbolISIN',
			headerName: 'نماد',
			cellClass: 'cursor-pointer font-medium',
			onCellClick: (row) => setSymbol(row[side]?.symbolISIN),
			valueGetter: (row) => row[side]?.symbolTitle ?? '−',
		},
		{
			colId: 'closingPriceVarReferencePricePercent',
			headerName: 'درصد تغییر قیمت',
			cellClass: (row) => ['ltr', getColorBasedOnPercent(row[side]?.closingPriceVarReferencePricePercent)],
			valueGetter: (row) => row[side]?.closingPriceVarReferencePricePercent ?? 0,
			valueType: 'percent',
		},
		{
			colId: 'closingPriceVarReferencePrice',
			headerName: 'مقدار تغییر',
			valueGetter: (row) => row[side]?.closingPriceVarReferencePrice ?? 0,
			valueType: 'separate',
		},
		{
			colId: 'dueDays',
			headerName: 'مانده تا سررسید (روز)',
			valueGetter: (row) => row[side]?.dueDays ?? 0,
			valueType: 'separate',
		},
	];

	const getOptionTradesVolumeColDefs = (
		side: TOptionSides,
	): Array<IColDef<Record<TOptionSides, Dashboard.GetTopSymbols.Option.Volume>>> => [
		{
			colId: 'symbolISIN',
			headerName: 'نماد',
			cellClass: 'cursor-pointer font-medium',
			onCellClick: (row) => setSymbol(row[side]?.symbolISIN),
			valueGetter: (row) => row[side]?.symbolTitle,
		},
		{
			colId: 'totalNumberOfSharesTraded',
			headerName: 'حجم معاملات',
			valueGetter: (row) => row[side]?.totalNumberOfSharesTraded ?? 0,
			valueType: 'separate',
		},
		{
			colId: 'totalNumberOfSharesTradedVarPercent',
			headerName: 'درصد تغییر حجم',
			cellClass: (row) => ['ltr', getColorBasedOnPercent(row[side]?.totalNumberOfSharesTradedVarPercent)],
			valueGetter: (row) => row[side]?.totalNumberOfSharesTradedVarPercent ?? 0,
			valueType: 'percent',
		},
		{
			colId: 'dueDays',
			headerName: 'مانده تا سررسید (روز)',
			valueGetter: (row) => row[side]?.dueDays ?? 0,
			valueType: 'separate',
		},
	];

	const getBaseSymbolOpenCallPositionsColDefs = (): Array<
		IColDef<Dashboard.GetTopSymbols.BaseSymbol.CallOpenPosition>
	> => [
		{
			colId: 'baseSymbolISIN',
			headerName: 'نماد',
			cellClass: 'cursor-pointer font-medium',
			onCellClick: (row) => setSymbol(row.baseSymbolISIN),
			valueGetter: (row) => row.baseSymbolTitle ?? '−',
		},
		{
			colId: 'openPosition',
			headerName: 'تعداد موقعیت‌های باز خرید',
			valueGetter: (row) => row.openPosition ?? 0,
			valueType: 'separate',
		},
		{
			colId: 'openPositionVarPercent',
			headerName: 'تغییر موقعیت‌های باز خرید',
			cellClass: (row) => ['ltr', getColorBasedOnPercent(row.openPositionVarPercent)],
			valueGetter: (row) => row.openPositionVarPercent ?? 0,
			valueType: 'percent',
		},
		{
			colId: 'contractCount',
			headerName: 'تعداد قراردادهای دارای موقعیت باز خرید',
			valueGetter: (row) => row.contractCount ?? 0,
			valueType: 'separate',
		},
		{
			colId: 'closestEndDate',
			headerName: 'نزدیکترین سررسید',
			valueGetter: (row) => new Date(row.closestEndDate).getTime(),
			valueFormatter: ({ value }) => dateFormatter(Number(value), 'date'),
		},
	];

	const getBaseSymbolOpenPutPositionsColDefs = (): Array<
		IColDef<Dashboard.GetTopSymbols.BaseSymbol.PutOpenPosition>
	> => [
		{
			colId: 'baseSymbolISIN',
			headerName: 'نماد',
			cellClass: 'cursor-pointer font-medium',
			onCellClick: (row) => setSymbol(row.baseSymbolISIN),
			valueGetter: (row) => row.baseSymbolTitle ?? '−',
		},
		{
			colId: 'openPosition',
			headerName: 'تعداد موقعیت‌های باز فروش',
			valueGetter: (row) => row.openPosition ?? 0,
			valueType: 'separate',
		},
		{
			colId: 'openPositionVarPercent',
			headerName: 'تغییر موقعیت‌های باز فروش',
			cellClass: (row) => ['ltr', getColorBasedOnPercent(row.openPositionVarPercent)],
			valueGetter: (row) => row.openPositionVarPercent ?? 0,
			valueType: 'percent',
		},
		{
			colId: 'contractCount',
			headerName: 'تعداد قراردادهای دارای موقعیت باز فروش',
			valueGetter: (row) => row.contractCount ?? 0,
			valueType: 'separate',
		},
		{
			colId: 'closestEndDate',
			headerName: 'نزدیکترین سررسید',
			valueGetter: (row) => new Date(row.closestEndDate).getTime(),
			valueFormatter: ({ value }) => dateFormatter(Number(value), 'date'),
		},
	];

	const getBaseSymbolTradesVolumeColDefs = (): Array<IColDef<Dashboard.GetTopSymbols.BaseSymbol.Volume>> => [
		{
			colId: 'baseSymbolISIN',
			headerName: 'نماد',
			cellClass: 'cursor-pointer font-medium',
			onCellClick: (row) => setSymbol(row.baseSymbolISIN),
			valueGetter: (row) => row.symbolTitle ?? '−',
		},
		{
			colId: 'totalNumberOfSharesTraded',
			headerName: 'حجم معاملات',
			valueGetter: (row) => row.totalNumberOfSharesTraded ?? 0,
			valueType: 'separate',
		},
		{
			colId: 'thirtyDayVolume',
			headerName: 'میانگین حجم 30 روز',
			valueGetter: (row) => row.thirtyDayVolume ?? 0,
			valueType: 'separate',
		},
		{
			colId: 'ninetyDayVolume',
			headerName: 'میانگین حجم 90 روز',
			valueGetter: (row) => row.ninetyDayVolume ?? 0,
			valueType: 'separate',
		},
		{
			colId: 'lastTradedPrice',
			headerName: 'آخرین قیمت',
			cellClass: 'ltr',
			valueGetter: (row) => row.lastTradedPrice ?? 0,
			valueFormatter: ({ row: { lastTradedPrice, tradePriceVarPreviousTradePercent } }) => (
				<ValuePercent value={lastTradedPrice} percent={tradePriceVarPreviousTradePercent} />
			),
		},
	];

	const getBaseSymbolTradesValueColDefs = (): Array<IColDef<Dashboard.GetTopSymbols.BaseSymbol.Value>> => [
		{
			colId: 'symbolISIN',
			headerName: 'نماد',
			cellClass: 'cursor-pointer font-medium',
			onCellClick: (row) => setSymbol(row.symbolISIN),
			valueGetter: (row) => row.symbolTitle ?? '−',
		},
		{
			colId: 'totalTradeValue',
			headerName: 'ارزش معاملات',
			valueGetter: (row) => row.totalTradeValue ?? 0,
			valueType: 'separate',
		},
		{
			colId: 'thirtyDayValue',
			headerName: 'میانگین ارزش 30 روز',
			valueGetter: (row) => row.thirtyDayValue ?? 0,
			valueType: 'separate',
		},
		{
			colId: 'ninetyDayValue',
			headerName: 'میانگین ارزش 90 روز',
			valueGetter: (row) => row.ninetyDayValue ?? 0,
			valueType: 'separate',
		},
		{
			colId: 'lastTradedPrice',
			headerName: 'آخرین قیمت',
			cellClass: 'ltr',
			valueGetter: (row) => row.lastTradedPrice ?? 0,
			valueFormatter: ({ row: { lastTradedPrice, tradePriceVarPreviousTradePercent } }) => (
				<ValuePercent value={lastTradedPrice} percent={tradePriceVarPreviousTradePercent} />
			),
		},
	];

	const getBaseSymbolOpenPositionColDefs = (): Array<IColDef<Dashboard.GetTopSymbols.BaseSymbol.OpenPosition>> => [
		{
			colId: 'baseSymbolISIN',
			headerName: 'نماد',
			cellClass: 'cursor-pointer font-medium',
			onCellClick: (row) => setSymbol(row.baseSymbolISIN),
			valueGetter: (row) => row.baseSymbolTitle ?? '−',
		},
		{
			colId: 'openPosition',
			headerName: 'تعداد موقعیت باز',
			valueGetter: (row) => row.openPosition ?? 0,
			valueType: 'separate',
		},
		{
			colId: 'openPositionVarPercent',
			headerName: 'تغییر موقعیت باز',
			cellClass: (row) => ['ltr', getColorBasedOnPercent(row.openPositionVarPercent)],
			valueGetter: (row) => row.openPositionVarPercent ?? 0,
			valueType: 'percent',
		},
		{
			colId: 'contractCount',
			headerName: 'تعداد قراردادهای دارای موقعیت باز',
			valueGetter: (row) => row.contractCount ?? 0,
			valueType: 'separate',
		},
		{
			colId: 'closestEndDate',
			headerName: 'نزدیکترین سررسید',
			valueGetter: (row) => new Date(row.closestEndDate).getTime(),
			valueFormatter: ({ value }) => dateFormatter(Number(value), 'date'),
		},
	];

	const getSymbolTradesVolumeColDefs = (): Array<IColDef<Dashboard.GetTopSymbols.Symbol.Volume>> => [
		{
			colId: 'symbolISIN',
			headerName: 'نماد',
			cellClass: 'cursor-pointer font-medium',
			onCellClick: (row) => setSymbol(row.symbolISIN),
			valueGetter: (row) => row.symbolTitle ?? '−',
		},
		{
			colId: 'totalNumberOfSharesTraded',
			headerName: 'حجم معاملات',
			valueGetter: (row) => row.totalNumberOfSharesTraded ?? 0,
			valueType: 'separate',
		},
		{
			colId: 'thirtyDayVolume',
			headerName: 'میانگین حجم 30 روز',
			valueGetter: (row) => row.thirtyDayVolume ?? 0,
			valueType: 'separate',
		},
		{
			colId: 'ninetyDayVolume',
			headerName: 'میانگین حجم 90 روز',
			valueGetter: (row) => row.ninetyDayVolume ?? 0,
			valueType: 'separate',
		},
		{
			colId: 'tradePriceVarPreviousTradePercent',
			headerName: 'آخرین قیمت',
			cellClass: 'ltr',
			valueGetter: (row) => row.tradePriceVarPreviousTradePercent ?? 0,
			valueFormatter: ({ row: { lastTradedPrice, tradePriceVarPreviousTradePercent } }) => (
				<ValuePercent value={lastTradedPrice} percent={tradePriceVarPreviousTradePercent} />
			),
		},
	];

	const getSymbolTradesValueColDefs = (): Array<IColDef<Dashboard.GetTopSymbols.Symbol.Value>> => [
		{
			colId: 'symbolISIN',
			headerName: 'نماد',
			cellClass: 'cursor-pointer font-medium',
			onCellClick: (row) => setSymbol(row.symbolISIN),
			valueGetter: (row) => row.symbolTitle,
		},
		{
			colId: 'totalTradeValue',
			headerName: 'ارزش معاملات',
			valueGetter: (row) => row.totalTradeValue ?? 0,
			valueType: 'separate',
		},
		{
			colId: 'thirtyDayValue',
			headerName: 'میانگین ارزش 30 روز',
			valueGetter: (row) => row.thirtyDayValue ?? 0,
			valueType: 'separate',
		},
		{
			colId: 'ninetyDayValue',
			headerName: 'میانگین ارزش 90 روز',
			valueGetter: (row) => row.ninetyDayValue ?? 0,
			valueType: 'separate',
		},
		{
			colId: 'lastTradedPrice',
			headerName: 'آخرین قیمت',
			cellClass: 'ltr',
			valueGetter: (row) => row.tradePriceVarPreviousTradePercent ?? 0,
			valueFormatter: ({ row: { lastTradedPrice, tradePriceVarPreviousTradePercent } }) => (
				<ValuePercent value={lastTradedPrice} percent={tradePriceVarPreviousTradePercent} />
			),
		},
	];

	const getColumnDefinitions = useCallback(
		(side: TOptionSides) => {
			switch (type) {
				case 'OptionValue':
					return getOptionValueColDefs(side);
				case 'OptionOpenPosition':
					return getOptionOpenPositionsColDefs(side);
				case 'OptionTradeCount':
					return getOptionTradesCountColDefs(side);
				case 'OptionYesterdayDiff':
					return getOptionYesterdayDiffColDefs(side);
				case 'OptionVolume':
					return getOptionTradesVolumeColDefs(side);
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
		},
		[type],
	);

	const [data, isLoading]: [Dashboard.GetTopSymbols.Data, boolean] =
		symbolType === 'Option'
			? [optionTopSymbolsData ?? [], isLoadingOptionTopSymbols]
			: symbolType === 'BaseSymbol'
				? [baseTopSymbolsData ?? [], isLoadingBaseTopSymbolsData]
				: [topSymbolsData ?? [], isLoadingTopSymbolsData];

	return (
		<div className='relative h-full'>
			{isLoading ? (
				<Loading />
			) : data.length > 0 ? (
				<div className='flex h-full gap-12'>
					<TableWrapper type='put' title={t('home.put_option')} isOption={symbolType === 'Option'}>
						<LightweightTable
							rowHeight={40}
							headerHeight={40}
							rowData={data}
							columnDefs={getColumnDefinitions('put') as TCol}
						/>
					</TableWrapper>

					{symbolType === 'Option' && (
						<TableWrapper type='call' title={t('home.call_option')} isOption={symbolType === 'Option'}>
							<LightweightTable
								rowHeight={40}
								headerHeight={40}
								rowData={data}
								columnDefs={getColumnDefinitions('call') as TCol}
							/>
						</TableWrapper>
					)}
				</div>
			) : (
				<NoData />
			)}
		</div>
	);
};

const TableWrapper = ({ children, title, isOption, type }: TableWrapperProps) => (
	<div className='h-full text-center flex-column'>
		{isOption && (
			<h3 className={clsx('pb-8 text-base', type === 'call' ? 'text-success-100' : 'text-error-100')}>{title}</h3>
		)}
		<div
			className={clsx(
				'flex-1 overflow-hidden rounded',
				isOption && ['border-t', type === 'call' ? 'border-t-success-100' : 'border-t-error-100'],
			)}
		>
			{children}
		</div>
	</div>
);

const ValuePercent = ({ value, percent }: ValuePercentProps) => (
	<>
		{toFixed(value)}
		<span className={`pl-4 ${getColorBasedOnPercent(percent)}`}>({toFixed(percent)}%)</span>
	</>
);

export default BestTable;
