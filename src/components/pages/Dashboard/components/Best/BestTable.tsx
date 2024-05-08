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
import { dateFormatter, sepNumbers, toFixed } from '@/utils/helpers';
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
			headerName: 'نماد',
			cellClass: 'cursor-pointer font-medium',
			onCellClick: (row) => setSymbol(row[side].symbolISIN),
			valueFormatter: (row) => row[side].symbolTitle,
		},
		{
			headerName: 'ارزش',
			valueFormatter: (row) => sepNumbers(String(row[side].totalTradeValue ?? 0)),
		},
		{
			headerName: 'آخرین قیمت',
			valueFormatter: (row) => sepNumbers(String(row[side].lastTradedPrice ?? 0)),
		},
		{
			headerName: 'مانده تا سررسید (روز)',
			valueFormatter: (row) => row[side].dueDays,
		},
	];

	const getOptionOpenPositionsColDefs = (
		side: TOptionSides,
	): Array<IColDef<Record<TOptionSides, Dashboard.GetTopSymbols.Option.OpenPosition>>> => [
		{
			headerName: 'نماد',
			cellClass: 'cursor-pointer font-medium',
			onCellClick: (row) => setSymbol(row[side].symbolISIN),
			valueFormatter: (row) => row[side].symbolTitle,
		},
		{
			headerName: 'موقعیت باز',
			valueFormatter: (row) => sepNumbers(String(row[side].openPositionCount ?? 0)),
		},
		{
			headerName: 'مقدار (درصد تغییر)',
			cellClass: 'ltr',
			valueFormatter: (row) => {
				const { openPositionVarPercent, openPositionCountDiff } = row[side];

				return (
					<>
						{toFixed(openPositionCountDiff)}
						<span className={`pl-4 ${openPositionVarPercent < 0 ? 'text-error-100' : 'text-success-100'}`}>
							({toFixed(openPositionVarPercent)}%)
						</span>
					</>
				);
			},
		},
		{
			headerName: 'مانده تا سررسید (روز)',
			valueFormatter: (row) => row[side].dueDays,
		},
	];

	const getOptionTradesCountColDefs = (
		side: TOptionSides,
	): Array<IColDef<Record<TOptionSides, Dashboard.GetTopSymbols.Option.TradeCount>>> => [
		{
			headerName: 'نماد',
			cellClass: 'cursor-pointer font-medium',
			onCellClick: (row) => setSymbol(row[side].symbolISIN),
			valueFormatter: (row) => row[side].symbolTitle,
		},
		{
			headerName: 'تعداد معاملات',
			valueFormatter: (row) => sepNumbers(String(row[side].totalNumberOfTrades ?? 0)),
		},
		{
			headerName: 'درصد تغییر تعداد',
			cellClass: (row) => [
				'ltr',
				row[side].totalNumberOfTradesVarPercent < 0 ? 'text-error-100' : 'text-success-100',
			],
			valueFormatter: (row) => `${toFixed(row[side].totalNumberOfTradesVarPercent)}%`,
		},
		{
			headerName: 'مانده تا سررسید (روز)',
			valueFormatter: (row) => row[side].dueDays,
		},
	];

	const getOptionYesterdayDiffColDefs = (
		side: TOptionSides,
	): Array<IColDef<Record<TOptionSides, Dashboard.GetTopSymbols.Option.YesterdayDiff>>> => [
		{
			headerName: 'نماد',
			cellClass: 'cursor-pointer font-medium',
			onCellClick: (row) => setSymbol(row[side].symbolISIN),
			valueFormatter: (row) => row[side].symbolTitle,
		},
		{
			headerName: 'درصد تغییر قیمت',
			cellClass: (row) => [
				'ltr',
				row[side].closingPriceVarReferencePricePercent < 0 ? 'text-error-100' : 'text-success-100',
			],
			valueFormatter: (row) => `${toFixed(row[side].closingPriceVarReferencePricePercent)}%`,
		},
		{
			headerName: 'مقدار تغییر',
			valueFormatter: (row) => sepNumbers(String(row[side].closingPriceVarReferencePrice ?? 0)),
		},
		{
			headerName: 'مانده تا سررسید (روز)',
			valueFormatter: (row) => row[side].dueDays,
		},
	];

	const getOptionTradesVolumeColDefs = (
		side: TOptionSides,
	): Array<IColDef<Record<TOptionSides, Dashboard.GetTopSymbols.Option.Volume>>> => [
		{
			headerName: 'نماد',
			cellClass: 'cursor-pointer font-medium',
			onCellClick: (row) => setSymbol(row[side].symbolISIN),
			valueFormatter: (row) => row[side].symbolTitle,
		},
		{
			headerName: 'حجم معاملات',
			valueFormatter: (row) => sepNumbers(String(row[side].totalNumberOfSharesTraded ?? 0)),
		},
		{
			headerName: 'درصد تغییر حجم',
			cellClass: (row) => [
				'ltr',
				row[side].totalNumberOfSharesTradedVarPercent < 0 ? 'text-error-100' : 'text-success-100',
			],
			valueFormatter: (row) => `${toFixed(row[side].totalNumberOfSharesTradedVarPercent)}%`,
		},
		{
			headerName: 'مانده تا سررسید (روز)',
			valueFormatter: (row) => row[side].dueDays,
		},
	];

	const getBaseSymbolOpenCallPositionsColDefs = (): Array<
		IColDef<Dashboard.GetTopSymbols.BaseSymbol.CallOpenPosition>
	> => [
		{
			headerName: 'نماد',
			cellClass: 'cursor-pointer font-medium',
			onCellClick: (row) => setSymbol(row.baseSymbolISIN),
			valueFormatter: (row) => row.baseSymbolTitle,
		},
		{
			headerName: 'تعداد موقعیت‌های باز خرید',
			valueFormatter: (row) => sepNumbers(String(row.openPosition)),
		},
		{
			headerName: 'تغییر موقعیت‌های باز خرید',
			cellClass: (row) => ['ltr', row.openPositionVarPercent < 0 ? 'text-error-100' : 'text-success-100'],
			valueFormatter: (row) => `${toFixed(row.openPositionVarPercent)}%`,
		},
		{
			headerName: 'تعداد قراردادهای دارای موقعیت باز خرید',
			valueFormatter: (row) => sepNumbers(String(row.contractCount)),
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
			cellClass: 'cursor-pointer font-medium',
			onCellClick: (row) => setSymbol(row.baseSymbolISIN),
			valueFormatter: (row) => row.baseSymbolTitle,
		},
		{
			headerName: 'تعداد موقعیت‌های باز فروش',
			valueFormatter: (row) => sepNumbers(String(row.openPosition)),
		},
		{
			headerName: 'تغییر موقعیت‌های باز فروش',
			cellClass: (row) => ['ltr', row.openPositionVarPercent < 0 ? 'text-error-100' : 'text-success-100'],
			valueFormatter: (row) => `${toFixed(row.openPositionVarPercent)}%`,
		},
		{
			headerName: 'تعداد قراردادهای دارای موقعیت باز فروش',
			valueFormatter: (row) => sepNumbers(String(row.contractCount)),
		},
		{
			headerName: 'نزدیکترین سررسید',
			valueFormatter: (row) => dateFormatter(row.closestEndDate, 'date'),
		},
	];

	const getBaseSymbolTradesVolumeColDefs = (): Array<IColDef<Dashboard.GetTopSymbols.BaseSymbol.Volume>> => [
		{
			headerName: 'نماد',
			cellClass: 'cursor-pointer font-medium',
			onCellClick: (row) => setSymbol(row.baseSymbolISIN),
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
			headerName: 'آخرین قیمت',
			cellClass: 'ltr',
			valueFormatter: (row) => sepNumbers(String(row.lastTradedPrice ?? 0)),
		},
	];

	const getBaseSymbolTradesValueColDefs = (): Array<IColDef<Dashboard.GetTopSymbols.BaseSymbol.Value>> => [
		{
			headerName: 'نماد',
			cellClass: 'cursor-pointer font-medium',
			onCellClick: (row) => setSymbol(row.symbolISIN),
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
			headerName: 'آخرین قیمت',
			cellClass: 'ltr',
			valueFormatter: (row) => sepNumbers(String(row.lastTradedPrice ?? 0)),
		},
	];

	const getBaseSymbolOpenPositionColDefs = (): Array<IColDef<Dashboard.GetTopSymbols.BaseSymbol.OpenPosition>> => [
		{
			headerName: 'نماد',
			cellClass: 'cursor-pointer font-medium',
			onCellClick: (row) => setSymbol(row.baseSymbolISIN),
			valueFormatter: (row) => row.baseSymbolTitle,
		},
		{
			headerName: 'تعداد موقعیت باز',
			valueFormatter: (row) => sepNumbers(String(row.openPosition ?? 0)),
		},
		{
			headerName: 'تغییر موقعیت باز',
			cellClass: (row) => ['ltr', row.openPositionVarPercent < 0 ? 'text-error-100' : 'text-success-100'],
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
			cellClass: 'cursor-pointer font-medium',
			onCellClick: (row) => setSymbol(row.symbolISIN),
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
			headerName: 'آخرین قیمت',
			cellClass: 'ltr',
			valueFormatter: (row) => sepNumbers(String(row.lastTradedPrice ?? 0)),
		},
	];

	const getSymbolTradesValueColDefs = (): Array<IColDef<Dashboard.GetTopSymbols.Symbol.Value>> => [
		{
			headerName: 'نماد',
			cellClass: 'cursor-pointer font-medium',
			onCellClick: (row) => setSymbol(row.symbolISIN),
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
			headerName: 'آخرین قیمت',
			cellClass: 'ltr',
			valueFormatter: (row) => sepNumbers(String(row.lastTradedPrice ?? 0)),
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
						<LightweightTable rowData={data} columnDefs={getColumnDefinitions('put') as TCol} />
					</TableWrapper>

					{symbolType === 'Option' && (
						<TableWrapper type='call' title={t('home.call_option')} isOption={symbolType === 'Option'}>
							<LightweightTable rowData={data} columnDefs={getColumnDefinitions('call') as TCol} />
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

export default BestTable;
