import axios from '@/api/axios';
import routes from '@/api/routes';
import lightStreamInstance from '@/classes/Lightstream';
import AgTable from '@/components/common/Tables/AgTable';
import CellPercentRenderer from '@/components/common/Tables/Cells/CellPercentRenderer';
import HeaderHint from '@/components/common/Tables/Headers/HeaderHint';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setAddNewOptionWatchlistModal, setMoveSymbolToWatchlistModal } from '@/features/slices/modalSlice';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { getOptionWatchlistColumns, setOptionWatchlistColumns } from '@/features/slices/tableSlice';
import { getIsLoggedIn } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { useOptionWatchlistColumns, useSubscription } from '@/hooks';
import { dateFormatter, numFormatter, sepNumbers, toFixed } from '@/utils/helpers';
import { type ColDef, type ColumnMovedEvent, type GridApi, type ICellRendererParams } from '@ag-grid-community/core';
import { createSelector } from '@reduxjs/toolkit';
import { useQueryClient } from '@tanstack/react-query';
import { type ItemUpdate } from 'lightstreamer-client-web';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import ActionColumn from './ActionColumn';

interface WatchlistTableProps {
	id: number;
	data: Option.Root[];
	watchlistCount: number;
	fetchNextPage: () => void;
}

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		isLoggedIn: getIsLoggedIn(state),
		watchlistColumnsIndex: getOptionWatchlistColumns(state),
	}),
);

const WatchlistTable = ({ id, data, watchlistCount, fetchNextPage }: WatchlistTableProps) => {
	const t = useTranslations();

	const { subscribe } = useSubscription();

	const queryClient = useQueryClient();

	const { isLoggedIn, watchlistColumnsIndex } = useAppSelector(getStates);

	const visualData = useRef<Option.Root[]>([]);

	const gridRef = useRef<GridApi<Option.Root>>(null);

	const dispatch = useAppDispatch();

	const { watchlistColumns, defaultOptionWatchlistColumns } = useOptionWatchlistColumns();

	const onColumnMoved = ({ finished, toIndex }: ColumnMovedEvent<Option.Root>) => {
		try {
			if (!finished || toIndex === undefined) return;
			storeColumns();
		} catch (e) {
			//
		}
	};

	const onSymbolTitleClicked = (symbolISIN: string) => {
		dispatch(setSymbolInfoPanel(symbolISIN));
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

	const onDelete = async (symbol: Option.Root) => {
		try {
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
		if (watchlistCount === 0) {
			toast.info(t('alerts.add_watchlist'), { toastId: 'add_watchlist' });
			dispatch(setAddNewOptionWatchlistModal({}));
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

	const onSymbolUpdate = (updateInfo: ItemUpdate) => {
		const symbolISIN: string = updateInfo.getItemName();
		const symbolIndex = visualData.current.findIndex(({ symbolInfo }) => symbolInfo.symbolISIN === symbolISIN);

		if (symbolIndex === -1) return;

		updateInfo.forEachChangedField((fieldName, _b, value) => {
			try {
				const symbol = visualData.current[symbolIndex];

				if (value !== null && fieldName in symbol) {
					// console.log(fieldName, value);
				}
			} catch (e) {
				//
			}
		});

		queryClient.setQueryData(['sameSectorSymbolsQuery', symbolISIN], visualData.current);
	};

	const symbolsISIN = useMemo(() => {
		if (!Array.isArray(data)) return [];
		return data.map((item) => item.symbolInfo.symbolISIN);
	}, [data]);

	const modifiedWatchlistColumns = useMemo(() => {
		const result: Record<string, Option.Column> = {};
		if (watchlistColumns.length === 0) return result;

		try {
			for (let i = 0; i < watchlistColumns.length; i++) {
				const item = watchlistColumns[i];
				result[item.title] = item;
			}

			return result;
		} catch (e) {
			return result;
		}
	}, [watchlistColumns]);

	const COLUMNS = useMemo(
		() =>
			[
				{
					colId: 'symbolTitle',
					headerName: t('option_page.symbol_title'),
					initialHide: Boolean(modifiedWatchlistColumns?.symbolTitle?.isHidden ?? true),
					minWidth: 96,
					pinned: 'right',
					lockPosition: true,
					suppressMovable: true,
					cellClass: 'cursor-pointer',
					onCellClicked: ({ data }) => onSymbolTitleClicked(data!.symbolInfo.symbolISIN),
					valueGetter: ({ data }) => data?.symbolInfo.symbolTitle ?? '',
					comparator: (valueA, valueB) => valueA.localeCompare(valueB),
				},
				{
					colId: 'tradeValue',
					headerName: t('option_page.trade_value'),
					initialHide: Boolean(modifiedWatchlistColumns?.tradeValue?.isHidden ?? true),
					minWidth: 120,
					initialSort: 'desc',
					valueGetter: ({ data }) => data?.optionWatchlistData.tradeValue,
					valueFormatter: ({ value }) => numFormatter(value),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'notionalValue',
					headerName: t('option_page.notional_value'),
					minWidth: 160,
					initialHide: Boolean(modifiedWatchlistColumns?.notionalValue?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.notionalValue ?? 0,
					valueFormatter: ({ value }) => numFormatter(value),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'IntrinsicValue',
					headerName: t('option_page.intrinsic_value'),
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.IntrinsicValue?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.intrinsicValue ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'premium',
					headerName: t('option_page.premium'),
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
					colId: 'delta',
					headerName: t('option_page.delta'),
					initialHide: Boolean(modifiedWatchlistColumns?.delta?.isHidden ?? true),
					minWidth: 72,
					valueGetter: ({ data }) => data?.optionWatchlistData.delta ?? 0,
					valueFormatter: ({ value }) => toFixed(value, 4),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'baseSymbolPrice',
					headerName: t('option_page.base_symbol_price'),
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
					colId: 'breakEvenPoint',
					headerName: t('option_page.break_even_point'),
					initialHide: Boolean(modifiedWatchlistColumns?.breakEvenPoint?.isHidden ?? true),
					minWidth: 96,
					valueGetter: ({ data }) => data?.optionWatchlistData.breakEvenPoint ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'leverage',
					headerName: t('option_page.leverage'),
					initialHide: Boolean(modifiedWatchlistColumns?.leverage?.isHidden ?? true),
					minWidth: 64,
					valueGetter: ({ data }) => data?.optionWatchlistData.leverage ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'openPositionCount',
					headerName: t('option_page.open_position_count'),
					initialHide: Boolean(modifiedWatchlistColumns?.openPositionCount?.isHidden ?? true),
					minWidth: 128,
					valueGetter: ({ data }) => data?.optionWatchlistData.openPositionCount ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'impliedVolatility',
					headerName: t('option_page.implied_volatility'),
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
					colId: 'iotm',
					headerName: t('option_page.iotm'),
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
					colId: 'blackScholes',
					headerName: t('option_page.black_scholes'),
					initialHide: Boolean(modifiedWatchlistColumns?.blackScholes?.isHidden ?? true),
					minWidth: 144,
					headerComponent: HeaderHint,
					headerComponentParams: {
						tooltip: t('option_page.black_scholes_tooltip'),
					},
					valueGetter: ({ data }) => data?.optionWatchlistData.blackScholes ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'tradeVolume',
					headerName: t('option_page.trade_volume'),
					initialHide: Boolean(modifiedWatchlistColumns?.tradeVolume?.isHidden ?? true),
					minWidth: 104,
					valueGetter: ({ data }) => data?.optionWatchlistData.tradeVolume ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'dueDays',
					headerName: t('option_page.due_days'),
					initialHide: Boolean(modifiedWatchlistColumns?.dueDays?.isHidden ?? true),
					minWidth: 96,
					valueGetter: ({ data }) => Math.max(0, data?.symbolInfo.dueDays ?? 0),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'strikePrice',
					headerName: t('option_page.strike_price'),
					initialHide: Boolean(modifiedWatchlistColumns?.strikePrice?.isHidden ?? true),
					minWidth: 112,
					valueGetter: ({ data }) => data?.symbolInfo.strikePrice ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'bestBuyPrice',
					headerName: t('option_page.best_buy_price'),
					initialHide: Boolean(modifiedWatchlistColumns?.bestBuyPrice?.isHidden ?? true),
					minWidth: 112,
					cellClass: 'buy',
					valueGetter: ({ data }) => data?.optionWatchlistData.bestBuyPrice ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'bestSellPrice',
					headerName: t('option_page.best_sell_price'),
					initialHide: Boolean(modifiedWatchlistColumns?.bestSellPrice?.isHidden ?? true),
					minWidth: 120,
					cellClass: 'sell',
					valueGetter: ({ data }) => data?.optionWatchlistData.bestSellPrice ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'baseSymbolTitle',
					headerName: t('option_page.base_symbol_title'),
					cellClass: 'cursor-pointer',
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.baseSymbolTitle?.isHidden ?? true),
					onCellClicked: ({ data }) => onSymbolTitleClicked(data!.symbolInfo.baseSymbolISIN),
					valueGetter: ({ data }) => data?.symbolInfo.baseSymbolTitle ?? '',
					comparator: (valueA, valueB) => valueA.localeCompare(valueB),
				},
				{
					colId: 'closingPrice',
					headerName: t('option_page.closing_price'),
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.closingPrice?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.closingPrice ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'historicalVolatility',
					headerName: t('option_page.historical_volatility'),
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.historicalVolatility?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.historicalVolatility ?? 0,
					valueFormatter: ({ value }) => {
						if (isNaN(value)) return '−';
						return value.toFixed(2);
					},
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'contractSize',
					headerName: t('option_page.contract_size'),
					minWidth: 112,
					initialHide: Boolean(modifiedWatchlistColumns?.contractSize?.isHidden ?? true),
					valueGetter: ({ data }) => data?.symbolInfo.contractSize ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'timeValue',
					headerName: t('option_page.time_value'),
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.timeValue?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.timeValue ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'theta',
					headerName: t('option_page.theta'),
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.theta?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.theta ?? 0,
					valueFormatter: ({ value }) => toFixed(value, 4),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'tradeCount',
					headerName: t('option_page.trade_count'),
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.tradeCount?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.tradeCount ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'contractEndDate',
					headerName: t('option_page.contract_end_date'),
					minWidth: 120,
					initialHide: Boolean(modifiedWatchlistColumns?.contractEndDate?.isHidden ?? true),
					valueGetter: ({ data }) =>
						data?.symbolInfo.contractEndDate
							? new Date(data?.symbolInfo.contractEndDate).getTime()
							: new Date().getTime(),
					valueFormatter: ({ value }) => dateFormatter(value, 'date'),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'spread',
					headerName: t('option_page.spread'),
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.spread?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.spread ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'blackScholesDifference',
					headerName: t('option_page.black_scholes_difference'),
					minWidth: 200,
					initialHide: Boolean(modifiedWatchlistColumns?.blackScholesDifference?.isHidden ?? true),
					headerComponent: HeaderHint,
					headerComponentParams: {
						tooltip: t('option_page.black_scholes_hint'),
					},
					cellRenderer: CellPercentRenderer,
					cellRendererParams: ({ value }: ICellRendererParams<Option.Root>) => ({
						percent: value[1] ?? 0,
					}),
					valueGetter: ({ data }) => [
						data?.optionWatchlistData.blackScholes ?? 0,
						data?.optionWatchlistData.blackScholesDifference ?? 0,
					],
					valueFormatter: ({ value }) => sepNumbers(String(value[0])),
					comparator: (valueA, valueB) => valueA[1] - valueB[1],
				},
				{
					colId: 'baseClosingPrice',
					headerName: t('option_page.base_closing_price'),
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.baseClosingPrice?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.baseClosingPrice ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'gamma',
					headerName: t('option_page.gamma'),
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.gamma?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.gamma ?? 0,
					valueFormatter: ({ value }) => toFixed(value, 4),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'optionType',
					headerName: t('option_page.option_type'),
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.optionType?.isHidden ?? true),
					cellClass: ({ value }) => {
						switch (value) {
							case 'Call':
								return 'text-success-100';
							case 'Put':
								return 'text-error-100';
							default:
								return 'text-gray-700';
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
					colId: 'requiredMargin',
					headerName: t('option_page.required_margin'),
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.requiredMargin?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.requiredMargin ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'initialMargin',
					headerName: t('option_page.initial_margin'),
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.initialMargin?.isHidden ?? true),
					valueGetter: ({ data }) => data?.symbolInfo.initialMargin ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'rho',
					headerName: t('option_page.rho'),
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.rho?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.rho ?? 0,
					valueFormatter: ({ value }) => toFixed(value, 4),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'vega',
					headerName: t('option_page.vega'),
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.vega?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.vega ?? 0,
					valueFormatter: ({ value }) => toFixed(value, 4),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				/* {
					colId: 'growth',
					headerName: t('option_page.growth'),
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.growth?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.growth ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				}, */
				/* {
					colId: 'contractValueType',
					headerName: t('option_page.contract_value_type'),
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.contractValueType?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.contractValueType ?? 'LIQ',
					comparator: (valueA, valueB) => valueA.localeCompare(valueB),
				}, */
				/* {
					colId: 'highOpenPosition',
					headerName: t('option_page.high_open_position'),
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.highOpenPosition?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.highOpenPosition ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				}, */
				{
					colId: 'lastTradeDate',
					headerName: t('option_page.last_trade_date'),
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.lastTradeDate?.isHidden ?? true),
					valueGetter: ({ data }) =>
						data?.optionWatchlistData.lastTradeDate
							? new Date(data?.optionWatchlistData.lastTradeDate).getTime()
							: new Date().getTime(),
					valueFormatter: ({ value }) => dateFormatter(value, 'datetime'),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'legalBuyVolume',
					headerName: t('option_page.legal_buy_volume'),
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.legalBuyVolume?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.legalBuyVolume ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'individualBuyVolume',
					headerName: t('option_page.individual_buy_volume'),
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.individualBuyVolume?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.individualBuyVolume ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'legalSellVolume',
					headerName: t('option_page.legalSell_volume'),
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.legalSellVolume?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.legalSellVolume ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'individualSellVolume',
					headerName: t('option_page.individual_sell_volume'),
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.individualSellVolume?.isHidden ?? true),
					valueGetter: ({ data }) => data?.optionWatchlistData.individualSellVolume ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				},
				{
					colId: 'sectorName',
					headerName: t('option_page.sector_name'),
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.sectorName?.isHidden ?? true),
					valueGetter: ({ data }) => data?.symbolInfo.sectorName ?? '',
					comparator: (valueA, valueB) => valueA.localeCompare(valueB),
				},
				{
					colId: 'action',
					headerName: t('option_page.action'),
					initialHide: Boolean(modifiedWatchlistColumns?.action?.isHidden ?? true),
					minWidth: 80,
					maxWidth: 80,
					pinned: 'left',
					hide: false,
					resizable: false,
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
		[watchlistCount],
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

		const newColDef = COLUMNS[COLUMNS.length - 1];

		actionColumn.setColDef(newColDef, newColDef, 'api');
	}, [isLoggedIn, watchlistCount, id]);

	useEffect(() => {
		const gridApi = gridRef.current;
		if (!gridApi) return;

		if (!Array.isArray(watchlistColumnsIndex) || watchlistColumnsIndex.length === 0) return;

		if (typeof watchlistColumnsIndex[0] === 'object' && 'colId' in watchlistColumnsIndex[0]) {
			gridApi.applyColumnState({ state: watchlistColumnsIndex, applyOrder: true });
		} else {
			dispatch(setOptionWatchlistColumns(defaultOptionWatchlistColumns));
			gridApi.applyColumnState({ state: defaultOptionWatchlistColumns, applyOrder: true });
		}
	}, [watchlistColumnsIndex]);

	useEffect(() => {
		const eGrid = gridRef.current;
		if (!eGrid) return;

		try {
			const dataIsEmpty = !Array.isArray(data) || data.length === 0;

			if (dataIsEmpty) {
				eGrid.setGridOption('rowData', []);
				visualData.current = [];

				return;
			}

			const transaction: Record<'add' | 'remove' | 'update', Option.Root[]> = {
				add: [],
				remove: [],
				update: [],
			};

			const cWatchlistData = visualData.current;
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
			visualData.current = data;
		} catch (e) {
			//
		}
	}, [JSON.stringify(data)]);

	useEffect(() => {
		const eGrid = gridRef.current;
		if (!eGrid || watchlistColumns.length === 0) return;

		try {
			for (let i = 0; i < watchlistColumns.length; i++) {
				const { isHidden, title } = watchlistColumns[i];
				eGrid.setColumnsVisible([title], !isHidden);
			}
		} catch (e) {
			//
		}
	}, [watchlistColumns]);

	useEffect(() => {
		const sub = lightStreamInstance.subscribe({
			mode: 'MERGE',
			items: symbolsISIN,
			fields: [
				'tradeValue',
				'notionalValue',
				'IntrinsicValue',
				'lastTradedPrice',
				'delta',
				'baseSymbolPrice',
				'breakEvenPoint',
				'leverage',
				'openPositionCount',
				'impliedVolatility',
				'iotm',
				'blackScholes',
				'tradeVolume',
				'dueDays',
				'strikePrice',
				'bestBuyPrice',
				'bestSellPrice',
				'baseSymbolTitle',
				'closingPrice',
				'historicalVolatility',
				'contractSize',
				'timeValue',
				'theta',
				'tradeCount',
				'contractEndDate',
				'spread',
				'blackScholesDifference',
				'baseClosingPrice',
				'gamma',
				'optionType',
				'requiredMargin',
				'initialMargin',
				'rho',
				'vega',
				'growth',
				'contractValueType',
				'highOpenPosition',
				'lastTradeDate',
				'legalBuyVolume',
				'individualBuyVolume',
				'legalSellVolume',
				'individualSellVolume',
			],
			dataAdapter: 'RamandRLCDData',
			snapshot: true,
		});

		sub.addEventListener('onItemUpdate', onSymbolUpdate);
		sub.start();

		subscribe(sub);
	}, [symbolsISIN.join(',')]);

	return (
		<AgTable
			ref={gridRef}
			useTransaction
			className='h-full border-0'
			style={{ height: `${(data.length + 1) * 5}rem` }}
			columnDefs={COLUMNS}
			defaultColDef={defaultColDef}
			onColumnMoved={onColumnMoved}
			onSortChanged={storeColumns}
			getRowId={({ data }) => data!.symbolInfo.symbolISIN}
			onBodyScrollEnd={({ api }) => {
				const lastRowIndex = api.getLastDisplayedRowIndex();
				if ((lastRowIndex + 1) % 20 <= 1) fetchNextPage();
			}}
		/>
	);
};

export default WatchlistTable;
