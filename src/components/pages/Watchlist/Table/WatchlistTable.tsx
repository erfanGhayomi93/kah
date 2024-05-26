import axios from '@/api/axios';
import routes from '@/api/routes';
import AgTable from '@/components/common/Tables/AgTable';
import CellPercentRenderer from '@/components/common/Tables/Cells/CellPercentRenderer';
import { defaultOptionWatchlistColumns } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setLoginModal, setMoveSymbolToWatchlistModal } from '@/features/slices/modalSlice';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { getOptionWatchlistColumns, setOptionWatchlistColumns } from '@/features/slices/tableSlice';
import { getIsLoggedIn } from '@/features/slices/userSlice';
import { useWatchlistColumns } from '@/hooks';
import dayjs from '@/libs/dayjs';
import { numFormatter, sepNumbers, toFixed } from '@/utils/helpers';
import {
	type CellClickedEvent,
	type ColDef,
	type ColumnMovedEvent,
	type GridApi,
	type ICellRendererParams,
} from '@ag-grid-community/core';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import ActionColumn from './ActionColumn';

interface WatchlistTableProps {
	id: number;
	data: Option.Root[] | null;
	fetchNextPage: () => void;
}

const WatchlistTable = ({ id, data, fetchNextPage }: WatchlistTableProps) => {
	const t = useTranslations();

	const queryClient = useQueryClient();

	const isLoggedIn = useAppSelector(getIsLoggedIn);

	const cWatchlistRef = useRef<Option.Root[]>([]);

	const gridRef = useRef<GridApi<Option.Root>>(null);

	const dispatch = useAppDispatch();

	const watchlistColumnsIndex = useAppSelector(getOptionWatchlistColumns);

	const { data: watchlistColumns } = useWatchlistColumns();

	const onColumnMoved = ({ finished, toIndex }: ColumnMovedEvent<Option.Root>) => {
		try {
			if (!finished || toIndex === undefined) return;
			storeColumns();
		} catch (e) {
			//
		}
	};

	const onSymbolTitleClicked = ({ data }: CellClickedEvent<Option.Root>) => {
		try {
			if (!data) return;

			const { symbolISIN, baseSymbolISIN } = data.symbolInfo;

			if (baseSymbolISIN && symbolISIN) dispatch(setSymbolInfoPanel(symbolISIN));
		} catch (e) {
			//
		}
	};

	const storeColumns = () => {
		try {
			const gridApi = gridRef.current;
			if (!gridApi) return;

			const columnState = gridApi.getColumnState() as TOptionWatchlistColumnsState;
			gridApi.applyColumnState({
				state: columnState,
				applyOrder: true,
			});

			dispatch(setOptionWatchlistColumns(columnState));
		} catch (e) {
			//
		}
	};

	const dateFormatter = (v: string | number) => {
		if (v === undefined || v === null) return '−';
		return dayjs(v).calendar('jalali').format('YYYY/MM/DD');
	};

	const onDelete = async (symbol: Option.Root) => {
		try {
			if (!isLoggedIn) {
				toast.error(t('alerts.login_to_your_account'));
				dispatch(setLoginModal({}));
				return;
			}

			const { symbolISIN, symbolTitle } = symbol.symbolInfo;

			try {
				const gridApi = gridRef.current;
				if (gridApi) {
					const queryKey = ['optionWatchlistQuery', { watchlistId: id ?? -1 }];

					queryClient.setQueriesData(
						{
							exact: false,
							queryKey,
						},
						(c) => {
							return (c as Option.Root[]).filter((item) => item.symbolInfo.symbolISIN !== symbolISIN);
						},
					);
				}
			} catch (e) {
				//
			}

			await axios.post(routes.optionWatchlist.RemoveSymbolCustomWatchlist, {
				id,
				symbolISIN,
			});

			const toastId = 'watchlist_symbol_removed_successfully';
			if (toast.isActive(toastId)) {
				toast.update(toastId, {
					render: t('alerts.watchlist_symbol_removed_successfully', { symbolTitle }),
					autoClose: 2500,
				});
			} else {
				toast.success(t('alerts.watchlist_symbol_removed_successfully', { symbolTitle }), {
					toastId: 'watchlist_symbol_removed_successfully',
					autoClose: 2500,
				});
			}
		} catch (e) {
			//
		}
	};

	const onAdd = (symbol: Option.Root) => {
		if (!isLoggedIn) {
			toast.error(t('alerts.login_to_your_account'));
			dispatch(setLoginModal({}));
			return;
		}

		const { symbolISIN, symbolTitle } = symbol.symbolInfo;

		dispatch(
			setMoveSymbolToWatchlistModal({
				symbolISIN,
				symbolTitle,
			}),
		);
	};

	const modifiedWatchlistColumns = useMemo(() => {
		const result: Record<string, Option.Column> = {};

		try {
			if (!watchlistColumns) return result;

			for (let i = 0; i < watchlistColumns.length; i++) {
				const item = watchlistColumns[i];
				result[item.title] = item;
			}

			return result;
		} catch (e) {
			return result;
		}
	}, [JSON.stringify(watchlistColumns)]);

	const COLUMNS = useMemo(
		() =>
			[
				{
					headerName: t('option_page.symbol_title'),
					colId: 'symbolTitle',
					initialHide: Boolean(modifiedWatchlistColumns?.symbolTitle?.isHidden ?? true),
					minWidth: 96,
					pinned: 'right',
					lockPosition: true,
					suppressMovable: true,
					cellClass: 'cursor-pointer',
					onCellClicked: onSymbolTitleClicked,
					valueGetter: ({ data }) => data?.symbolInfo.symbolTitle ?? '',
					comparator: (valueA, valueB) => valueA.localeCompare(valueB),
				},
				{
					headerName: t('option_page.trade_value'),
					colId: 'tradeValue',
					initialHide: Boolean(modifiedWatchlistColumns?.tradeValue?.isHidden ?? true),
					minWidth: 120,
					initialSort: 'desc',
					valueGetter: ({ data }) => data?.optionWatchlistData.tradeValue,
					valueFormatter: ({ value }) => numFormatter(value),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.notional_value'),
					colId: 'notionalValue',
					minWidth: 160,
					initialHide: Boolean(modifiedWatchlistColumns?.notionalValue?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.notionalValue ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.intrinsic_value'),
					colId: 'IntrinsicValue',
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.IntrinsicValue?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.intrinsicValue ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.premium'),
					colId: 'premium',
					initialHide: Boolean(modifiedWatchlistColumns?.premium?.isHidden ?? true),
					minWidth: 128,
					cellRenderer: CellPercentRenderer,
					cellRendererParams: ({ value }: ICellRendererParams<Option.Root>) => ({
						percent: value[1] ?? 0,
					}),
					valueGetter: ({ data }) => [
						data?.optionWatchlistData.premium ?? 0,
						data?.optionWatchlistData.tradePriceVarPreviousTradePercent ?? 0,
					],
					valueFormatter: ({ value }) => sepNumbers(String(value[0])),
					comparator: (valueA, valueB) => valueA[1] - valueB[1],
				},
				{
					headerName: t('option_page.delta'),
					colId: 'delta',
					initialHide: Boolean(modifiedWatchlistColumns?.delta?.isHidden ?? true),
					minWidth: 56,
					valueGetter: ({ data }) => data?.optionWatchlistData.delta ?? 0,
					valueFormatter: ({ value }) => toFixed(value, 4),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.base_symbol_price'),
					colId: 'baseSymbolPrice',
					initialHide: Boolean(modifiedWatchlistColumns?.baseSymbolPrice?.isHidden ?? true),
					minWidth: 136,
					cellRenderer: CellPercentRenderer,
					cellRendererParams: ({ value }: ICellRendererParams<Option.Root>) => ({
						percent: value[1] ?? 0,
					}),
					valueGetter: ({ data }) => [
						data?.optionWatchlistData.baseSymbolPrice ?? 0,
						data?.optionWatchlistData.baseTradePriceVarPreviousTradePercent ?? 0,
					],
					valueFormatter: ({ value }) => sepNumbers(String(value[0])),
					comparator: (valueA, valueB) => valueA[1] - valueB[1],
				},
				{
					headerName: t('option_page.break_even_point'),
					colId: 'breakEvenPoint',
					initialHide: Boolean(modifiedWatchlistColumns?.breakEvenPoint?.isHidden ?? true),
					minWidth: 96,
					valueGetter: ({ data }) => data?.optionWatchlistData.breakEvenPoint ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.leverage'),
					colId: 'leverage',
					initialHide: Boolean(modifiedWatchlistColumns?.leverage?.isHidden ?? true),
					minWidth: 64,
					valueGetter: ({ data }) => data?.optionWatchlistData.leverage ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.open_position_count'),
					colId: 'openPositionCount',
					initialHide: Boolean(modifiedWatchlistColumns?.openPositionCount?.isHidden ?? true),
					minWidth: 128,
					valueGetter: ({ data }) => data?.optionWatchlistData.openPositionCount ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.implied_volatility'),
					colId: 'impliedVolatility',
					initialHide: Boolean(modifiedWatchlistColumns?.impliedVolatility?.isHidden ?? true),
					minWidth: 96,
					valueGetter: ({ data }) => data?.optionWatchlistData.impliedVolatility ?? 0,
					valueFormatter: ({ value }) => {
						if (isNaN(value)) return '−';
						return value.toFixed(2);
					},
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.iotm'),
					colId: 'iotm',
					initialHide: Boolean(modifiedWatchlistColumns?.iotm?.isHidden ?? true),
					minWidth: 96,
					cellClass: ({ value }) => {
						switch (value) {
							case 'ITM':
								return 'text-success-100';
							case 'OTM':
								return 'text-error-100';
							case 'ATM':
								return 'text-secondary-300';
							default:
								return '';
						}
					},
					valueGetter: ({ data }) => data?.optionWatchlistData.iotm ?? 'ATM',
					comparator: (valueA, valueB) => valueA.localeCompare(valueB),
				},
				{
					headerName: t('option_page.black_scholes'),
					colId: 'blackScholes',
					initialHide: Boolean(modifiedWatchlistColumns?.blackScholes?.isHidden ?? true),
					minWidth: 144,
					valueGetter: ({ data }) => data?.optionWatchlistData.blackScholes ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.trade_volume'),
					colId: 'tradeVolume',
					initialHide: Boolean(modifiedWatchlistColumns?.tradeVolume?.isHidden ?? true),
					minWidth: 104,
					valueGetter: ({ data }) => data?.optionWatchlistData.tradeVolume ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.due_days'),
					colId: 'dueDays',
					initialHide: Boolean(modifiedWatchlistColumns?.dueDays?.isHidden ?? true),
					minWidth: 96,
					valueGetter: ({ data }) => Math.max(0, data?.symbolInfo.dueDays ?? 0),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.strike_price'),
					colId: 'strikePrice',
					initialHide: Boolean(modifiedWatchlistColumns?.strikePrice?.isHidden ?? true),
					minWidth: 112,
					valueGetter: ({ data }) => data?.symbolInfo.strikePrice ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.best_buy_price'),
					colId: 'bestBuyPrice',
					initialHide: Boolean(modifiedWatchlistColumns?.bestBuyPrice?.isHidden ?? true),
					minWidth: 112,
					cellClass: 'buy',
					valueGetter: ({ data }) => data?.optionWatchlistData.bestBuyPrice ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.best_sell_price'),
					colId: 'bestSellPrice',
					initialHide: Boolean(modifiedWatchlistColumns?.bestSellPrice?.isHidden ?? true),
					minWidth: 120,
					cellClass: 'sell',
					valueGetter: ({ data }) => data?.optionWatchlistData.bestSellPrice ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.base_symbol_title'),
					colId: 'baseSymbolTitle',
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.baseSymbolTitle?.isHidden ?? true),
					valueGetter: ({ data }) => data?.symbolInfo.baseSymbolTitle ?? '',
					comparator: (valueA, valueB) => valueA.localeCompare(valueB),
				},
				{
					headerName: t('option_page.closing_price'),
					colId: 'closingPrice',
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.closingPrice?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.closingPrice ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.historical_volatility'),
					colId: 'historicalVolatility',
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.historicalVolatility?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.impliedVolatility ?? 0,
					valueFormatter: ({ value }) => {
						if (isNaN(value)) return '−';
						return value.toFixed(2);
					},
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.contract_size'),
					colId: 'contractSize',
					minWidth: 112,
					initialHide: Boolean(modifiedWatchlistColumns?.contractSize?.isHidden ?? true),
					valueGetter: ({ data }) => data?.symbolInfo.contractSize ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.time_value'),
					colId: 'timeValue',
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.timeValue?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.timeValue ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.theta'),
					colId: 'theta',
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.theta?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.theta ?? 0,
					valueFormatter: ({ value }) => toFixed(value, 4),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.trade_count'),
					colId: 'tradeCount',
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.tradeCount?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.tradeCount ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.contract_end_date'),
					colId: 'contractEndDate',
					minWidth: 120,
					initialHide: Boolean(modifiedWatchlistColumns?.contractEndDate?.isHidden ?? true),
					valueGetter: ({ data }) =>
						data?.symbolInfo.contractEndDate
							? new Date(data?.symbolInfo.contractEndDate).getTime()
							: new Date().getTime(),
					valueFormatter: ({ value }) => dateFormatter(value),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.spread'),
					colId: 'spread',
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.spread?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.spread ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.black_scholes_difference'),
					colId: 'blackScholesDifference',
					minWidth: 144,
					initialHide: Boolean(modifiedWatchlistColumns?.blackScholesDifference?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.blackScholesDifference ?? 0,
					valueFormatter: ({ value }) => toFixed(value, 2),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.base_closing_price'),
					colId: 'baseClosingPrice',
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.baseClosingPrice?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.baseClosingPrice ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.gamma'),
					colId: 'gamma',
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.gamma?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.gamma ?? 0,
					valueFormatter: ({ value }) => toFixed(value, 4),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.option_type'),
					colId: 'optionType',
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.optionType?.isHidden ?? true),
					cellClass: ({ value }) => {
						switch (value) {
							case 'Call':
								return 'text-success-100';
							case 'Put':
								return 'text-error-100';
							default:
								return 'text-gray-900';
						}
					},
					valueGetter: ({ data }) => data?.symbolInfo.optionType ?? 'Call',
					valueFormatter: ({ value }) => {
						switch (value) {
							case 'Call':
								return t('side.buy');
							case 'Put':
								return t('side.sell');
							default:
								return '−';
						}
					},
					comparator: (valueA, valueB) => valueA.localeCompare(valueB),
				},
				{
					headerName: t('option_page.required_margin'),
					colId: 'requiredMargin',
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.requiredMargin?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.requiredMargin ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.initial_margin'),
					colId: 'initialMargin',
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.initialMargin?.isHidden ?? true),
					valueGetter: ({ data }) => data?.symbolInfo.initialMargin ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.rho'),
					colId: 'rho',
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.rho?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.rho ?? 0,
					valueFormatter: ({ value }) => toFixed(value, 4),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.vega'),
					colId: 'vega',
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.vega?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.vega ?? 0,
					valueFormatter: ({ value }) => toFixed(value, 4),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.growth'),
					colId: 'growth',
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.growth?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.growth ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.contract_value_type'),
					colId: 'contractValueType',
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.contractValueType?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.contractValueType ?? 'LIQ',
					comparator: (valueA, valueB) => valueA.localeCompare(valueB),
				},
				{
					headerName: t('option_page.high_open_position'),
					colId: 'highOpenPosition',
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.highOpenPosition?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.highOpenPosition ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.last_trade_date'),
					colId: 'lastTradeDate',
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.lastTradeDate?.isHidden ?? true),
					valueGetter: ({ data }) =>
						data?.optionWatchlistData.lastTradeDate
							? new Date(data?.optionWatchlistData.lastTradeDate).getTime()
							: new Date().getTime(),
					valueFormatter: ({ value }) => dateFormatter(value),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.legal_buy_volume'),
					colId: 'legalBuyVolume',
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.legalBuyVolume?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.legalBuyVolume ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.individual_buy_volume'),
					colId: 'individualBuyVolume',
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.individualBuyVolume?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.individualBuyVolume ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.legalSell_volume'),
					colId: 'legalSellVolume',
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.legalSellVolume?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.legalSellVolume ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.individual_sell_volume'),
					colId: 'individualSellVolume',
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.individualSellVolume?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.individualSellVolume ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					headerName: t('option_page.sector_name'),
					colId: 'sectorName',
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.sectorName?.isHidden ?? true),
					valueGetter: ({ data }) => data?.symbolInfo.sectorName ?? '',
					comparator: (valueA, valueB) => valueA.localeCompare(valueB),
				},
				{
					headerName: t('option_page.action'),
					colId: 'action',
					initialHide: Boolean(modifiedWatchlistColumns?.action?.isHidden ?? true),
					minWidth: 80,
					maxWidth: 80,
					pinned: 'left',
					hide: false,
					sortable: false,
					cellRenderer: ActionColumn,
					cellRendererParams: {
						onAdd,
						onDelete,
						addable: true,
						deletable: id > -1,
					},
				},
			] as Array<ColDef<Option.Root>>,
		[],
	);

	const defaultColDef: ColDef<Option.Root> = useMemo(
		() => ({
			sortable: true,
			resizable: false,
			flex: 1,
		}),
		[],
	);

	useEffect(() => {
		const gridApi = gridRef.current;
		if (!gridApi) return;

		const actionColumn = gridApi.getColumn('action');
		if (!actionColumn) return;

		const colDef: ColDef<Option.Root> = {
			headerName: t('option_page.action'),
			colId: 'action',
			initialHide: Boolean(modifiedWatchlistColumns?.action?.isHidden ?? true),
			minWidth: 80,
			maxWidth: 80,
			pinned: 'left',
			hide: false,
			sortable: false,
			resizable: false,
			cellRenderer: ActionColumn,
			cellRendererParams: {
				onAdd,
				onDelete,
				addable: true,
				deletable: id > -1,
			},
		};

		actionColumn.setColDef(colDef, colDef, 'api');
	}, [id]);

	useEffect(() => {
		const gridApi = gridRef.current;
		if (!gridApi) return;

		if (Array.isArray(watchlistColumnsIndex) && watchlistColumnsIndex.length > 0) {
			if (typeof watchlistColumnsIndex[0] === 'object' && 'colId' in watchlistColumnsIndex[0]) {
				gridApi.applyColumnState({ state: watchlistColumnsIndex, applyOrder: true });
			} else {
				dispatch(setOptionWatchlistColumns(defaultOptionWatchlistColumns));
				gridApi.applyColumnState({ state: defaultOptionWatchlistColumns, applyOrder: true });
			}
		}
	}, [watchlistColumnsIndex]);

	useEffect(() => {
		const eGrid = gridRef.current;
		if (!eGrid) return;

		try {
			const dataIsEmpty = !Array.isArray(data) || data.length === 0;

			if (dataIsEmpty) {
				eGrid.setGridOption('rowData', []);
				cWatchlistRef.current = [];

				return;
			}

			const transaction: Record<'add' | 'remove' | 'update', Option.Root[]> = {
				add: [],
				remove: [],
				update: [],
			};

			const cWatchlistData = cWatchlistRef.current;
			const length = Math.max(cWatchlistData.length, data.length);
			for (let i = 0; i < length; i++) {
				const newItem = data[i];
				if (newItem) {
					const matchingItem = cWatchlistData.find(
						(item) => item.symbolInfo.symbolISIN === newItem.symbolInfo.symbolISIN,
					);
					if (matchingItem) transaction.update.push(newItem);
					else transaction.add.push(newItem);
				}

				const oldItem = cWatchlistData[i];
				if (oldItem) {
					const matchingItem = data.find(
						(item) => item.symbolInfo.symbolISIN === oldItem.symbolInfo.symbolISIN,
					);
					if (!matchingItem) transaction.remove.push(oldItem);
				}
			}

			eGrid.applyTransactionAsync(transaction);
			cWatchlistRef.current = data;
		} catch (e) {
			//
		}
	}, [JSON.stringify(data)]);

	useEffect(() => {
		const eGrid = gridRef.current;
		if (!eGrid || !watchlistColumns) return;

		try {
			for (let i = 0; i < watchlistColumns.length; i++) {
				const { isHidden, title } = watchlistColumns[i];
				eGrid.setColumnsVisible([title], !isHidden);
			}
		} catch (e) {
			//
		}
	}, [watchlistColumns]);

	const dataIsEmpty = !Array.isArray(data) || data.length === 0;

	return (
		<AgTable
			ref={gridRef}
			useTransaction
			suppressHorizontalScroll={dataIsEmpty}
			className='h-full border-0'
			columnDefs={COLUMNS}
			defaultColDef={defaultColDef}
			onColumnMoved={onColumnMoved}
			onSortChanged={() => storeColumns()}
			getRowId={({ data }) => data!.symbolInfo.symbolISIN}
			onBodyScrollEnd={({ api }) => {
				const lastRowIndex = api.getLastDisplayedRowIndex();
				if ((lastRowIndex + 1) % 20 <= 1) fetchNextPage();
			}}
		/>
	);
};

export default WatchlistTable;
