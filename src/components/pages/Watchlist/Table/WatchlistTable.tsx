import { useDeleteCustomWatchlistSymbolMutation } from '@/api/mutations/watchlistMutations';
import lightStreamInstance from '@/classes/Lightstream';
import AgInfiniteTable from '@/components/common/Tables/AgInfiniteTable';
import CellPercentRenderer from '@/components/common/Tables/Cells/CellPercentRenderer';
import HeaderHint from '@/components/common/Tables/Headers/HeaderHint';
import { baseSymbolWatchlistLightstreamProperty, optionWatchlistLightstreamProperty } from '@/constants/ls-data-mapper';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setAddNewOptionWatchlistModal, setMoveSymbolToWatchlistModal } from '@/features/slices/modalSlice';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { getOptionWatchlistColumnsState, setOptionWatchlistColumnsState } from '@/features/slices/tableSlice';
import { useDebounce, useOptionWatchlistColumns, useSubscription } from '@/hooks';
import { dateFormatter, numFormatter, sepNumbers, toFixed } from '@/utils/helpers';
import { blackScholes, impliedVolatility } from '@/utils/math/black-scholes';
import {
	type ColDef,
	type ColumnMovedEvent,
	type GridApi,
	type ICellRendererParams,
	type IGetRowsParams,
	type IRowNode,
} from '@ag-grid-community/core';
import { useQueryClient } from '@tanstack/react-query';
import { type ItemUpdate } from 'lightstreamer-client-web';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import ActionColumn from './ActionColumn';
import SymbolTitleHeader from './SymbolTitleHeader';

interface WatchlistTableProps {
	id: number;
	data: Option.Root[];
	watchlistCount: number;
	isSubscribing: boolean;
	setTerm: (v: string) => void;
}

type TColDef = Omit<ColDef<Option.Root>, 'colId'> & { colId: keyof (Option.Watchlist & Option.SymbolInfo) };

const WatchlistTable = ({ id, data, watchlistCount, isSubscribing, setTerm }: WatchlistTableProps) => {
	const t = useTranslations();

	const gridRef = useRef<GridApi<Option.Root> | null>(null);

	const dataRef = useRef<Option.Root[]>([]);

	const { subscribe: subscribeOptions, unsubscribe: unsubscribeOptions } = useSubscription();

	const { subscribe: subscribeBaseSymbols, unsubscribe: unsubscribeBaseSymbols } = useSubscription();

	const { setDebounce } = useDebounce();

	const queryClient = useQueryClient();

	const watchlistColumnsState = useAppSelector(getOptionWatchlistColumnsState);

	const dispatch = useAppDispatch();

	const { mutate: deleteCustomWatchlistSymbol } = useDeleteCustomWatchlistSymbolMutation({
		onSuccess: (_d, { symbolTitle }) => {
			refetchWatchlist();

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
		},
	});

	const { watchlistColumns, defaultOptionWatchlistColumns } = useOptionWatchlistColumns();

	const [lastRowIndex, setLastRowIndex] = useState(0);

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

			dispatch(setOptionWatchlistColumnsState(columnState));
		} catch (e) {
			//
		}
	};

	const refetchWatchlist = () => {
		try {
			queryClient.refetchQueries({
				queryKey: ['optionCustomWatchlistQuery', { watchlistId: id ?? -1 }],
				exact: false,
			});
		} catch (e) {
			//
		}
	};

	const onAdd = (symbol: Option.Root) => {
		try {
			if (!symbol) return;

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
		} catch (e) {
			//
		}
	};

	const onOptionUpdate = (updateInfo: ItemUpdate) => {
		const symbolISIN: string = updateInfo.getItemName();

		const rowNode = findRowNode(symbolISIN);
		if (!rowNode) return;

		const symbolData = { ...rowNode.data! };
		updateInfo.forEachChangedField((fieldName, _b, value) => {
			if (value && fieldName in optionWatchlistLightstreamProperty) {
				const fs = optionWatchlistLightstreamProperty[fieldName];
				const valueAsNumber = Number(value);

				if (fs in symbolData.optionWatchlistData) {
					// @ts-expect-error: Typescript can not detect lightstream types
					symbolData.optionWatchlistData[fs] = isNaN(valueAsNumber) ? value : valueAsNumber;
				}
			}
		});

		symbolData.optionWatchlistData = {
			...symbolData.optionWatchlistData,
			...updateBlackScholes(symbolData),
		};

		rowNode.setData(symbolData);
	};

	const onBaseSymbolUpdate = (updateInfo: ItemUpdate) => {
		const symbolISIN: string = updateInfo.getItemName();

		const rowNodes = findRowNodes(symbolISIN);
		if (rowNodes.length === 0) return;

		rowNodes.forEach((rowNode) => {
			const rowData = rowNode.data!;

			updateInfo.forEachChangedField((fieldName, _b, value) => {
				if (value && fieldName in optionWatchlistLightstreamProperty) {
					const fs = baseSymbolWatchlistLightstreamProperty[fieldName];
					const valueAsNumber = Number(value);

					if (fs in rowData.optionWatchlistData) {
						// @ts-expect-error: Typescript can not detect lightstream types
						rowData.optionWatchlistData[fs] = isNaN(valueAsNumber) ? value : valueAsNumber;
					}
				}
			});

			rowNode.data!.optionWatchlistData = {
				...rowData.optionWatchlistData,
				...updateBlackScholes(rowData),
			};

			rowNode.setData(rowData);
		});
	};

	const updateBlackScholes = ({ symbolInfo, optionWatchlistData }: Option.Root) => {
		const isCall = symbolInfo.optionType === 'Call';
		const dueDays = Math.ceil(
			Math.abs(Date.now() - new Date(symbolInfo.contractEndDate).getTime()) / 1e3 / 24 / 60 / 60,
		);
		const rate = 0.3;
		const volatility = Number(optionWatchlistData.historicalVolatility) / 100;

		const { thetaCall, thetaPut, deltaCall, deltaPut, rhoCall, rhoPut, gamma, vega, call, put } = blackScholes({
			sharePrice: optionWatchlistData.baseSymbolPrice ?? 0,
			strikePrice: symbolInfo.strikePrice ?? 0,
			rate: 0.3,
			volatility,
			dueDays,
		});

		const iv = impliedVolatility({
			optionPrice: optionWatchlistData.premium,
			rate,
			strikePrice: symbolInfo.strikePrice,
			dueDays,
			contractType: 'put',
			sharePrice: optionWatchlistData.baseSymbolPrice ?? 0,
			stepCount: 5,
			volatility,
			step: 1,
		});

		const theta = isCall ? thetaCall : thetaPut;
		const delta = isCall ? deltaCall : deltaPut;
		const rho = isCall ? rhoCall : rhoPut;

		return { theta, delta, rho, gamma, vega, blackScholes: isCall ? call : put, impliedVolatility: iv };
	};

	const getRows = (params: IGetRowsParams) => {
		const newData = [...dataRef.current];
		const sortModel = params.sortModel[0];

		if (sortModel) {
			const { colId, sort } = sortModel;
			newData.sort((a, b) => {
				if (colId in a.symbolInfo && colId in b.symbolInfo) {
					const valueA = a.symbolInfo[colId as keyof Option.SymbolInfo];
					const valueB = b.symbolInfo[colId as keyof Option.SymbolInfo];

					return compare(valueA, valueB, sort);
				}

				if (colId in a.optionWatchlistData && colId in b.optionWatchlistData) {
					const valueA = a.optionWatchlistData[colId as keyof Option.Watchlist];
					const valueB = b.optionWatchlistData[colId as keyof Option.Watchlist];

					return compare(valueA, valueB, sort);
				}

				return 0;
			});
		}

		const rowsThisPage = newData.slice(params.startRow, params.endRow);
		let lastRow = -1;
		if (newData.length <= params.endRow) {
			lastRow = newData.length;
		}

		setLastRowIndex(params.endRow);
		params.successCallback(rowsThisPage, lastRow);
	};

	const updateDatasource = () => {
		gridRef.current?.setGridOption('datasource', {
			rowCount: data.length,
			getRows,
		});
	};

	const findRowNode = (symbolISIN: string): IRowNode<Option.Root> | undefined => {
		let result: IRowNode<Option.Root> | undefined;

		forEachRowNode((rowNode) => {
			const d = rowNode.data!;
			if (d.symbolInfo.symbolISIN === symbolISIN) {
				result = rowNode;
				return;
			}
		});

		return result;
	};

	const findRowNodes = (symbolISIN: string): Array<IRowNode<Option.Root>> => {
		const result: Array<IRowNode<Option.Root>> = [];

		forEachRowNode((rowNode) => {
			const d = rowNode.data!;
			if (d.symbolInfo.baseSymbolISIN === symbolISIN) {
				result.push(rowNode);
			}
		});

		return result;
	};

	const forEachRowNode = (cb: (rowNode: IRowNode<Option.Root>) => void) => {
		gridRef?.current?.forEachNode((rowNode) => {
			if (rowNode?.data) cb(rowNode);
		});
	};

	const compare = (valueA: string | number, valueB: string | number, sorting: 'asc' | 'desc'): number => {
		if (typeof valueA === 'string' && typeof valueB === 'string') {
			if (sorting === 'asc') return valueA.localeCompare(valueB);
			return valueB.localeCompare(valueA);
		}

		if (typeof valueA === 'number' && typeof valueB === 'number') {
			if (sorting === 'asc') return valueB - valueA;
			return valueA - valueB;
		}

		return 0;
	};

	const startOptionsSubscription = () => {
		const sub = lightStreamInstance.subscribe({
			mode: 'MERGE',
			items: optionsSymbolsISIN,
			fields: [
				'bestBuyLimitPrice_1',
				'bestSellLimitPrice_1',
				'totalTradeValue',
				'totalNumberOfSharesTraded',
				'closingPriceVarReferencePrice',
				'baseVolume',
				'firstTradedPrice',
				'lastTradedPrice',
				'totalNumberOfTrades',
				'lastTradedPriceVar',
				'lastTradedPriceVarPercent',
				'closingPrice',
				'closingPriceVar',
				'closingPriceVarPercent',
				'lastTradeDateTime',
				'lowestTradePriceOfTradingDay',
				'highestTradePriceOfTradingDay',
				'symbolState',
			],
			dataAdapter: 'RamandRLCDData',
			snapshot: true,
		});

		sub.addEventListener('onItemUpdate', onOptionUpdate);
		subscribeOptions(sub, isSubscribing);
	};

	const startBaseSymbolSubscription = () => {
		const sub = lightStreamInstance.subscribe({
			mode: 'MERGE',
			items: baseSymbolsISIN,
			fields: ['lastTradedPriceVarPercent', 'closingPriceVarPercent', 'lastTradedPrice', 'closingPrice'],
			dataAdapter: 'RamandRLCDData',
			snapshot: true,
		});

		sub.addEventListener('onItemUpdate', onBaseSymbolUpdate);
		subscribeBaseSymbols(sub, isSubscribing);
	};

	const symbolsISIN = useMemo(() => {
		if (!Array.isArray(data)) return [];
		return data.map((item) => item.symbolInfo.symbolISIN);
	}, [data]);

	const [optionsSymbolsISIN, baseSymbolsISIN] = useMemo(() => {
		if (lastRowIndex === 0) return [[], []];

		const optionsSymbolsISIN = new Set<string>();
		const baseSymbolsISIN = new Set<string>();

		data.slice(0, lastRowIndex).forEach((s) => {
			baseSymbolsISIN.add(s.symbolInfo.baseSymbolISIN);
			optionsSymbolsISIN.add(s.symbolInfo.symbolISIN);
		});

		return [Array.from(optionsSymbolsISIN), Array.from(baseSymbolsISIN)];
	}, [data, lastRowIndex]);

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

	const actionColumn = useMemo<TColDef>(
		() => ({
			colId: 'insCode',
			headerName: t('option_page.action'),
			initialHide: Boolean(modifiedWatchlistColumns?.action?.isHidden ?? false),
			minWidth: 80,
			maxWidth: 80,
			pinned: 'left',
			hide: false,
			resizable: false,
			sortable: false,
			cellRenderer: ActionColumn,
			cellRendererParams: {
				onAdd,
				onDelete: (symbol: Option.Root) =>
					deleteCustomWatchlistSymbol({
						watchlistId: id,
						symbolISIN: symbol.symbolInfo.symbolISIN,
						symbolTitle: symbol.symbolInfo.symbolTitle,
					}),
				addable: true,
				deletable: id > -1,
			},
		}),
		[id, watchlistCount],
	);

	const COLUMNS = useMemo<TColDef[]>(
		() => [
			{
				colId: 'symbolTitle',
				headerName: t('option_page.symbol_title'),
				initialHide: Boolean(modifiedWatchlistColumns?.symbolTitle?.isHidden ?? false),
				minWidth: 96,
				pinned: 'right',
				lockPosition: true,
				suppressMovable: true,
				cellClass: 'cursor-pointer font-medium',
				headerComponent: SymbolTitleHeader,
				headerComponentParams: {
					onChangeValue: (v: string) => setDebounce(() => setTerm(v), 350),
				},
				onCellClicked: ({ data }) => onSymbolTitleClicked(data!.symbolInfo.symbolISIN),
				valueGetter: ({ data }) => data?.symbolInfo.symbolTitle ?? '−',
				comparator: (valueA, valueB) => valueA.localeCompare(valueB),
			},
			{
				colId: 'tradeValue',
				headerName: t('option_page.trade_value'),
				initialHide: Boolean(modifiedWatchlistColumns?.tradeValue?.isHidden ?? false),
				minWidth: 120,
				initialSort: 'asc',
				valueGetter: ({ data }) => data?.optionWatchlistData.tradeValue,
				valueFormatter: ({ value }) => numFormatter(value),
				comparator: (valueA, valueB) => valueA - valueB,
			},
			{
				colId: 'notionalValue',
				headerName: t('option_page.notional_value'),
				minWidth: 160,
				initialHide: Boolean(modifiedWatchlistColumns?.notionalValue?.isHidden ?? false),
				valueGetter: ({ data }) => data?.optionWatchlistData.notionalValue ?? 0,
				valueFormatter: ({ value }) => numFormatter(value),
				comparator: (valueA, valueB) => valueA - valueB,
			},
			{
				colId: 'intrinsicValue',
				headerName: t('option_page.intrinsic_value'),
				minWidth: 96,
				initialHide: Boolean(modifiedWatchlistColumns?.IntrinsicValue?.isHidden ?? false),
				valueGetter: ({ data }) => data?.optionWatchlistData.intrinsicValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
				comparator: (valueA, valueB) => valueA - valueB,
			},
			{
				colId: 'tradePriceVarPreviousTradePercent',
				headerName: t('option_page.premium'),
				initialHide: Boolean(modifiedWatchlistColumns?.premium?.isHidden ?? false),
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
				initialHide: Boolean(modifiedWatchlistColumns?.delta?.isHidden ?? false),
				minWidth: 72,
				valueGetter: ({ data }) => data?.optionWatchlistData.delta ?? 0,
				valueFormatter: ({ value }) => toFixed(value, 4),
				comparator: (valueA, valueB) => valueA - valueB,
			},
			{
				colId: 'baseTradePriceVarPreviousTradePercent',
				headerName: t('option_page.base_symbol_price'),
				initialHide: Boolean(modifiedWatchlistColumns?.baseSymbolPrice?.isHidden ?? false),
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
				initialHide: Boolean(modifiedWatchlistColumns?.breakEvenPoint?.isHidden ?? false),
				minWidth: 96,
				valueGetter: ({ data }) => data?.optionWatchlistData.breakEvenPoint ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
				comparator: (valueA, valueB) => valueA - valueB,
			},
			{
				colId: 'leverage',
				headerName: t('option_page.leverage'),
				initialHide: Boolean(modifiedWatchlistColumns?.leverage?.isHidden ?? false),
				minWidth: 64,
				valueGetter: ({ data }) => data?.optionWatchlistData.leverage ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
				comparator: (valueA, valueB) => valueA - valueB,
			},
			{
				colId: 'openPositionCount',
				headerName: t('option_page.open_position_count'),
				initialHide: Boolean(modifiedWatchlistColumns?.openPositionCount?.isHidden ?? false),
				minWidth: 128,
				valueGetter: ({ data }) => data?.optionWatchlistData.openPositionCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
				comparator: (valueA, valueB) => valueA - valueB,
			},
			{
				colId: 'impliedVolatility',
				headerName: t('option_page.implied_volatility'),
				initialHide: Boolean(modifiedWatchlistColumns?.impliedVolatility?.isHidden ?? false),
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
				initialHide: Boolean(modifiedWatchlistColumns?.iotm?.isHidden ?? false),
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
				initialHide: Boolean(modifiedWatchlistColumns?.blackScholes?.isHidden ?? false),
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
				initialHide: Boolean(modifiedWatchlistColumns?.tradeVolume?.isHidden ?? false),
				minWidth: 104,
				valueGetter: ({ data }) => data?.optionWatchlistData.tradeVolume ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
				comparator: (valueA, valueB) => valueA - valueB,
			},
			{
				colId: 'dueDays',
				headerName: t('option_page.due_days'),
				initialHide: Boolean(modifiedWatchlistColumns?.dueDays?.isHidden ?? false),
				minWidth: 96,
				valueGetter: ({ data }) => Math.max(0, data?.symbolInfo.dueDays ?? 0),
				comparator: (valueA, valueB) => valueA - valueB,
			},
			{
				colId: 'strikePrice',
				headerName: t('option_page.strike_price'),
				initialHide: Boolean(modifiedWatchlistColumns?.strikePrice?.isHidden ?? false),
				minWidth: 112,
				valueGetter: ({ data }) => data?.symbolInfo.strikePrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
				comparator: (valueA, valueB) => valueA - valueB,
			},
			{
				colId: 'bestBuyPrice',
				headerName: t('option_page.best_buy_price'),
				initialHide: Boolean(modifiedWatchlistColumns?.bestBuyPrice?.isHidden ?? false),
				minWidth: 112,
				cellClass: 'buy',
				valueGetter: ({ data }) => data?.optionWatchlistData.bestBuyPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
				comparator: (valueA, valueB) => valueA - valueB,
			},
			{
				colId: 'bestSellPrice',
				headerName: t('option_page.best_sell_price'),
				initialHide: Boolean(modifiedWatchlistColumns?.bestSellPrice?.isHidden ?? false),
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
				initialHide: Boolean(modifiedWatchlistColumns?.baseSymbolTitle?.isHidden ?? false),
				onCellClicked: ({ data }) => onSymbolTitleClicked(data!.symbolInfo.baseSymbolISIN),
				valueGetter: ({ data }) => data?.symbolInfo.baseSymbolTitle ?? '−',
				comparator: (valueA, valueB) => valueA.localeCompare(valueB),
			},
			{
				colId: 'closingPrice',
				headerName: t('option_page.closing_price'),
				minWidth: 96,
				initialHide: Boolean(modifiedWatchlistColumns?.closingPrice?.isHidden ?? false),
				valueGetter: ({ data }) => data?.optionWatchlistData.closingPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
				comparator: (valueA, valueB) => valueA - valueB,
			},
			{
				colId: 'historicalVolatility',
				headerName: t('option_page.historical_volatility'),
				minWidth: 144,
				initialHide: Boolean(modifiedWatchlistColumns?.historicalVolatility?.isHidden ?? false),
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
				initialHide: Boolean(modifiedWatchlistColumns?.contractSize?.isHidden ?? false),
				valueGetter: ({ data }) => data?.symbolInfo.contractSize ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
				comparator: (valueA, valueB) => valueA - valueB,
			},
			{
				colId: 'timeValue',
				headerName: t('option_page.time_value'),
				minWidth: 96,
				initialHide: Boolean(modifiedWatchlistColumns?.timeValue?.isHidden ?? false),
				valueGetter: ({ data }) => data?.optionWatchlistData.timeValue ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
				comparator: (valueA, valueB) => valueA - valueB,
			},
			{
				colId: 'theta',
				headerName: t('option_page.theta'),
				minWidth: 96,
				initialHide: Boolean(modifiedWatchlistColumns?.theta?.isHidden ?? false),
				valueGetter: ({ data }) => data?.optionWatchlistData.theta ?? 0,
				valueFormatter: ({ value }) => toFixed(value, 4),
				comparator: (valueA, valueB) => valueA - valueB,
			},
			{
				colId: 'tradeCount',
				headerName: t('option_page.trade_count'),
				minWidth: 136,
				initialHide: Boolean(modifiedWatchlistColumns?.tradeCount?.isHidden ?? false),
				valueGetter: ({ data }) => data?.optionWatchlistData.tradeCount ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
				comparator: (valueA, valueB) => valueA - valueB,
			},
			{
				colId: 'contractEndDate',
				headerName: t('option_page.contract_end_date'),
				minWidth: 120,
				initialHide: Boolean(modifiedWatchlistColumns?.contractEndDate?.isHidden ?? false),
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
				initialHide: Boolean(modifiedWatchlistColumns?.spread?.isHidden ?? false),
				valueGetter: ({ data }) => data?.optionWatchlistData.spread ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
				comparator: (valueA, valueB) => valueA - valueB,
			},
			{
				colId: 'blackScholesDifference',
				headerName: t('option_page.black_scholes_difference'),
				minWidth: 200,
				initialHide: Boolean(modifiedWatchlistColumns?.blackScholesDifference?.isHidden ?? false),
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
				initialHide: Boolean(modifiedWatchlistColumns?.baseClosingPrice?.isHidden ?? false),
				valueGetter: ({ data }) => data?.optionWatchlistData.baseClosingPrice ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
				comparator: (valueA, valueB) => valueA - valueB,
			},
			{
				colId: 'gamma',
				headerName: t('option_page.gamma'),
				minWidth: 96,
				initialHide: Boolean(modifiedWatchlistColumns?.gamma?.isHidden ?? false),
				valueGetter: ({ data }) => data?.optionWatchlistData.gamma ?? 0,
				valueFormatter: ({ value }) => toFixed(value, 4),
				comparator: (valueA, valueB) => valueA - valueB,
			},
			{
				colId: 'optionType',
				headerName: t('option_page.option_type'),
				minWidth: 96,
				initialHide: Boolean(modifiedWatchlistColumns?.optionType?.isHidden ?? false),
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
				initialHide: Boolean(modifiedWatchlistColumns?.requiredMargin?.isHidden ?? false),
				valueGetter: ({ data }) => data?.optionWatchlistData.requiredMargin ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
				comparator: (valueA, valueB) => valueA - valueB,
			},
			{
				colId: 'initialMargin',
				headerName: t('option_page.initial_margin'),
				minWidth: 136,
				initialHide: Boolean(modifiedWatchlistColumns?.initialMargin?.isHidden ?? false),
				valueGetter: ({ data }) => data?.symbolInfo.initialMargin ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
				comparator: (valueA, valueB) => valueA - valueB,
			},
			{
				colId: 'rho',
				headerName: t('option_page.rho'),
				minWidth: 96,
				initialHide: Boolean(modifiedWatchlistColumns?.rho?.isHidden ?? false),
				valueGetter: ({ data }) => data?.optionWatchlistData.rho ?? 0,
				valueFormatter: ({ value }) => toFixed(value, 4),
				comparator: (valueA, valueB) => valueA - valueB,
			},
			{
				colId: 'vega',
				headerName: t('option_page.vega'),
				minWidth: 96,
				initialHide: Boolean(modifiedWatchlistColumns?.vega?.isHidden ?? false),
				valueGetter: ({ data }) => data?.optionWatchlistData.vega ?? 0,
				valueFormatter: ({ value }) => toFixed(value, 4),
				comparator: (valueA, valueB) => valueA - valueB,
			},
			/* {
					colId: 'growth',
					headerName: t('option_page.growth'),
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.growth?.isHidden ?? false),
					valueGetter: ({ data }) => data?.optionWatchlistData.growth ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				}, */
			/* {
					colId: 'contractValueType',
					headerName: t('option_page.contract_value_type'),
					minWidth: 96,
					initialHide: Boolean(modifiedWatchlistColumns?.contractValueType?.isHidden ?? false),
					valueGetter: ({ data }) => data?.optionWatchlistData.contractValueType ?? 'LIQ',
					comparator: (valueA, valueB) => valueA.localeCompare(valueB),
				}, */
			/* {
					colId: 'highOpenPosition',
					headerName: t('option_page.high_open_position'),
					minWidth: 136,
					initialHide: Boolean(modifiedWatchlistColumns?.highOpenPosition?.isHidden ?? false),
					valueGetter: ({ data }) => data?.optionWatchlistData.highOpenPosition ?? 0,
					valueFormatter: ({ value }) => sepNumbers(String(value)),
					comparator: (valueA, valueB) => valueA - valueB,
				}, */
			{
				colId: 'lastTradeDate',
				headerName: t('option_page.last_trade_date'),
				minWidth: 136,
				initialHide: Boolean(modifiedWatchlistColumns?.lastTradeDate?.isHidden ?? false),
				valueGetter: ({ data }) =>
					data?.optionWatchlistData.lastTradeDate
						? new Date(data?.optionWatchlistData.lastTradeDate).getTime()
						: new Date().getTime(),
				valueFormatter: ({ value }) => dateFormatter(value, 'date'),
				comparator: (valueA, valueB) => valueA - valueB,
			},
			{
				colId: 'legalBuyVolume',
				headerName: t('option_page.legal_buy_volume'),
				minWidth: 136,
				initialHide: Boolean(modifiedWatchlistColumns?.legalBuyVolume?.isHidden ?? false),
				valueGetter: ({ data }) => data?.optionWatchlistData.legalBuyVolume ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
				comparator: (valueA, valueB) => valueA - valueB,
			},
			{
				colId: 'individualBuyVolume',
				headerName: t('option_page.individual_buy_volume'),
				minWidth: 136,
				initialHide: Boolean(modifiedWatchlistColumns?.individualBuyVolume?.isHidden ?? false),
				valueGetter: ({ data }) => data?.optionWatchlistData.individualBuyVolume ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
				comparator: (valueA, valueB) => valueA - valueB,
			},
			{
				colId: 'legalSellVolume',
				headerName: t('option_page.legalSell_volume'),
				minWidth: 136,
				initialHide: Boolean(modifiedWatchlistColumns?.legalSellVolume?.isHidden ?? false),
				valueGetter: ({ data }) => data?.optionWatchlistData.legalSellVolume ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
				comparator: (valueA, valueB) => valueA - valueB,
			},
			{
				colId: 'individualSellVolume',
				headerName: t('option_page.individual_sell_volume'),
				minWidth: 136,
				initialHide: Boolean(modifiedWatchlistColumns?.individualSellVolume?.isHidden ?? false),
				valueGetter: ({ data }) => data?.optionWatchlistData.individualSellVolume ?? 0,
				valueFormatter: ({ value }) => sepNumbers(String(value)),
				comparator: (valueA, valueB) => valueA - valueB,
			},
			{
				colId: 'sectorName',
				headerName: t('option_page.sector_name'),
				minWidth: 264,
				initialHide: Boolean(modifiedWatchlistColumns?.sectorName?.isHidden ?? false),
				valueGetter: ({ data }) => data?.symbolInfo.sectorName ?? '',
				comparator: (valueA, valueB) => valueA.localeCompare(valueB),
			},
			actionColumn,
		],
		[],
	);

	useEffect(() => {
		const gridApi = gridRef.current;
		if (!gridApi) return;

		const col = gridApi.getColumn('action');
		if (!col) return;

		col.setColDef(actionColumn, actionColumn, 'api');
	}, [actionColumn]);

	useEffect(() => {
		const gridApi = gridRef.current;
		if (!gridApi) return;

		if (!Array.isArray(watchlistColumnsState) || watchlistColumnsState.length === 0) return;

		if (typeof watchlistColumnsState[0] === 'object' && 'colId' in watchlistColumnsState[0]) {
			gridApi.applyColumnState({ state: watchlistColumnsState, applyOrder: true });
		} else {
			dispatch(setOptionWatchlistColumnsState(defaultOptionWatchlistColumns));
			gridApi.applyColumnState({ state: defaultOptionWatchlistColumns, applyOrder: true });
		}
	}, [watchlistColumnsState]);

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
		dataRef.current = data;
	}, [data]);

	useEffect(() => {
		updateDatasource();
	}, [symbolsISIN.join(',')]);

	useEffect(() => startOptionsSubscription(), [optionsSymbolsISIN.join(',')]);

	useEffect(() => startBaseSymbolSubscription(), [baseSymbolsISIN.join(',')]);

	useEffect(() => {
		if (isSubscribing) {
			subscribeOptions();
			subscribeBaseSymbols();
		} else {
			unsubscribeOptions();
			unsubscribeBaseSymbols();
		}
	}, [isSubscribing]);

	return (
		<AgInfiniteTable
			ref={gridRef}
			className='border-0'
			style={{
				height: 'calc(100vh - 20rem)',
			}}
			columnDefs={COLUMNS}
			datasource={{
				rowCount: 0,
				getRows,
			}}
			defaultColDef={{
				sortable: true,
				flex: 1,
			}}
			onColumnMoved={onColumnMoved}
		/>
	);
};

export default WatchlistTable;
