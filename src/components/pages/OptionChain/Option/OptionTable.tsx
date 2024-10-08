import { useWatchlistBySettlementDateQuery } from '@/api/queries/optionQueries';
import lightStreamInstance from '@/classes/Lightstream';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import AgTable from '@/components/common/Tables/AgTable';
import { optionWatchlistLightstreamProperty } from '@/constants/ls-data-mapper';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getOptionChainColumns } from '@/features/slices/columnSlice';
import { setMoveSymbolToWatchlistModal } from '@/features/slices/modalSlice';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { getOrderBasket, setOrderBasket } from '@/features/slices/userSlice';
import { type RootState } from '@/features/store';
import { useSubscription } from '@/hooks';
import { convertSymbolWatchlistToSymbolBasket, sepNumbers } from '@/utils/helpers';
import { type CellClickedEvent, type ColDef, type ColGroupDef, type GridApi } from '@ag-grid-community/core';
import { createSelector } from '@reduxjs/toolkit';
import { useQueryClient } from '@tanstack/react-query';
import { type ItemUpdate } from 'lightstreamer-client-web';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import StrikePriceCellRenderer from './common/StrikePriceCellRenderer';

export interface ITableData {
	strikePrice: string;
	buy?: Option.Root;
	sell?: Option.Root;
}

interface OptionTableProps {
	settlementDay: Option.BaseSettlementDays;
	baseSymbol: Option.BaseSearch;
}

const getStates = createSelector(
	(state: RootState) => state,
	(state) => ({
		basket: getOrderBasket(state),
		optionChainColumns: getOptionChainColumns(state),
	}),
);

const OptionTable = ({ settlementDay, baseSymbol }: OptionTableProps) => {
	const t = useTranslations();

	const queryClient = useQueryClient();

	const dispatch = useAppDispatch();

	const { subscribe } = useSubscription();

	const { basket, optionChainColumns } = useAppSelector(getStates);

	const gridRef = useRef<GridApi<ITableData>>(null);

	const [activeRowId, setActiveRowId] = useState<number>(-1);

	const { data: watchlistData = [], isLoading } = useWatchlistBySettlementDateQuery({
		queryKey: [
			'watchlistBySettlementDateQuery',
			{ baseSymbolISIN: baseSymbol.symbolISIN, settlementDate: settlementDay?.contractEndDate },
		],
	});

	const onSymbolTitleClicked = ({ data }: CellClickedEvent<ITableData>, side: 'buy' | 'sell') => {
		try {
			if (!data) return;
			const symbolData = data[side];

			if (!symbolData) return;

			const { symbolISIN, baseSymbolISIN } = symbolData.symbolInfo;

			if (baseSymbolISIN && symbolISIN) dispatch(setSymbolInfoPanel(symbolISIN));
		} catch (e) {
			//
		}
	};

	const onSymbolUpdate = (updateInfo: ItemUpdate) => {
		const queryKey = [
			'watchlistBySettlementDateQuery',
			{ baseSymbolISIN: baseSymbol.symbolISIN, settlementDate: settlementDay?.contractEndDate },
		];

		const data = JSON.parse(JSON.stringify(queryClient.getQueryData(queryKey) ?? [])) as Option.Root[];
		const symbolISIN: string = updateInfo.getItemName();
		const symbolIndex = data.findIndex((item) => item.symbolInfo.symbolISIN === symbolISIN);

		if (symbolIndex === -1) return;

		const symbolData = data[symbolIndex];

		updateInfo.forEachChangedField((fieldName, _b, value) => {
			try {
				const fs = optionWatchlistLightstreamProperty[fieldName] as keyof Option.Watchlist;
				if (fs && value && fs in symbolData.optionWatchlistData) {
					const valueAsNumber = Number(value);

					// @ts-expect-error: Typescript can not detect lightstream types
					symbolData.optionWatchlistData[fs] = isNaN(valueAsNumber) ? value : valueAsNumber;
				}
			} catch (e) {
				//
			}
		});

		queryClient.setQueryData(queryKey, data);
	};

	const addSymbolToBasket = (data: Option.Root, side: TBsSides) => {
		const basketOrders = basket?.orders ?? [];
		const i = basketOrders.findIndex((item) => item.symbol.symbolISIN === data.symbolInfo.symbolISIN);

		if (i === -1) {
			const orders: OrderBasket.Order[] = [...basketOrders, convertSymbolWatchlistToSymbolBasket(data, side)];

			dispatch(
				setOrderBasket({
					baseSymbol: {
						symbolISIN: baseSymbol.symbolISIN,
						symbolTitle: baseSymbol.symbolTitle,
					},
					orders,
				}),
			);
		} else {
			const contractISIN = data.symbolInfo.symbolISIN;

			dispatch(
				setOrderBasket({
					baseSymbol: {
						symbolISIN: baseSymbol.symbolISIN,
						symbolTitle: baseSymbol.symbolTitle,
					},
					orders: basketOrders.map((item) => ({
						...item,
						side: item.symbol.symbolISIN === contractISIN ? side : item.side,
					})),
				}),
			);
		}
	};

	const addSymbolToWatchlist = (data: Option.Root) => {
		dispatch(
			setMoveSymbolToWatchlistModal({
				symbolISIN: data.symbolInfo.symbolISIN,
				symbolTitle: data.symbolInfo.symbolTitle,
			}),
		);
	};

	const addAlert = (data: Option.Root) => {
		//
	};

	const goToTechnicalChart = (data: Option.Root) => {
		//
	};

	const closestStrikePriceToBaseSymbolPrice = useMemo<number>(() => {
		if (!Array.isArray(watchlistData) || watchlistData.length === 0) return 0;

		const baseSymbolPrice = watchlistData[0].optionWatchlistData.baseSymbolPrice;

		return (
			watchlistData.find((item) => baseSymbolPrice - item.symbolInfo.strikePrice > 0)?.symbolInfo.strikePrice ?? 0
		);
	}, [watchlistData]);

	const symbolsISIN = useMemo(() => watchlistData.map((item) => item.symbolInfo.symbolISIN), [watchlistData]);

	const strikePriceColumn = useMemo<ColDef<ITableData>>(
		() => ({
			headerName: 'اعمال',
			colId: 'strikePrice',
			minWidth: 132,
			maxWidth: 132,
			resizable: false,
			cellClass: ({ data }) => {
				if (!data) return 'strike-price';

				const strikePrice = data.buy?.symbolInfo.strikePrice ?? data.sell?.symbolInfo.strikePrice ?? 0;
				if (strikePrice === closestStrikePriceToBaseSymbolPrice) {
					return 'strike-price highlight';
				}

				return 'strike-price';
			},
			headerClass: 'strike-price',
			valueGetter: ({ data }) => data!.buy?.symbolInfo.strikePrice ?? 0,
			valueFormatter: ({ value }) => sepNumbers(String(value)),
			comparator: (valueA, valueB) => valueA - valueB,
			cellRenderer: StrikePriceCellRenderer,
			cellRendererParams: {
				activeRowId,
				basket: [],
				addSymbolToBasket,
				addSymbolToWatchlist,
				addAlert,
				goToTechnicalChart,
			},
		}),
		[closestStrikePriceToBaseSymbolPrice, activeRowId, settlementDay, JSON.stringify(basket?.orders ?? [])],
	);

	const COLUMNS: Array<ColDef<ITableData> | ColGroupDef<ITableData>> = useMemo(
		() => [
			{
				groupId: 'call',
				headerName: t('option_chain.call_contracts'),
				headerClass: 'call',
				children: [
					{
						headerName: 'نماد',
						colId: 'symbolTitle-buy',
						width: 144,
						cellClass: 'cursor-pointer',
						onCellClicked: (api) => onSymbolTitleClicked(api, 'buy'),
						valueGetter: ({ data }) => data!.buy?.symbolInfo.symbolTitle,
						comparator: (valueA, valueB) => valueA.localeCompare(valueB),
					},

					{
						headerName: 'ارزش روز',
						colId: 'tradeValue-buy',
						width: 120,
						valueGetter: ({ data }) => data!.buy?.optionWatchlistData.tradeValue ?? 0,
						valueFormatter: ({ value }) => sepNumbers(String(value)),
						comparator: (valueA, valueB) => valueA - valueB,
					},

					{
						headerName: 'موقعیت‌های باز',
						colId: 'openPositionCount-buy',
						width: 144,
						valueGetter: ({ data }) => data!.buy?.optionWatchlistData.openPositionCount ?? 0,
						valueFormatter: ({ value }) => sepNumbers(String(value)),
						comparator: (valueA, valueB) => valueA - valueB,
					},

					{
						headerName: 'وضعیت',
						colId: 'iotm-buy',
						width: 96,
						cellClass: ({ value }) => {
							switch (value.toLowerCase()) {
								case 'itm':
									return 'text-success-100';
								case 'otm':
									return 'text-error-100';
								case 'atm':
									return 'text-secondary-300';
								default:
									return '';
							}
						},
						valueGetter: ({ data }) => data!.buy?.optionWatchlistData.iotm,
						comparator: (valueA, valueB) => valueA.localeCompare(valueB),
					},

					{
						headerName: 'بهترین خرید',
						colId: 'bestBuyPrice-buy',
						flex: 1,
						cellClass: 'text-success-100',
						valueGetter: ({ data }) => data!.buy?.optionWatchlistData.bestBuyPrice ?? 0,
						valueFormatter: ({ value }) => sepNumbers(String(value)),
						comparator: (valueA, valueB) => valueA - valueB,
					},

					{
						headerName: 'بهترین فروش',
						colId: 'bestSellPrice-buy',
						flex: 1,
						cellClass: 'text-error-100',
						valueGetter: ({ data }) => data!.buy?.optionWatchlistData.bestSellPrice ?? 0,
						valueFormatter: ({ value }) => sepNumbers(String(value)),
						comparator: (valueA, valueB) => valueA - valueB,
					},
				],
			},

			{
				groupId: 'strike',
				headerName: '',
				headerClass: 'bg-white darkness:bg-gray-50',
				children: [strikePriceColumn],
			},

			{
				groupId: 'put',
				headerName: t('option_chain.put_contracts'),
				headerClass: 'put',
				children: [
					{
						headerName: 'بهترین خرید',
						colId: 'bestBuyPrice-sell',
						flex: 1,
						cellClass: 'text-success-100',
						valueGetter: ({ data }) => data!.sell?.optionWatchlistData.bestBuyPrice ?? 0,
						valueFormatter: ({ value }) => sepNumbers(String(value)),
						comparator: (valueA, valueB) => valueA - valueB,
					},

					{
						headerName: 'بهترین فروش',
						colId: 'bestSellPrice-sell',
						flex: 1,
						cellClass: 'text-error-100',
						valueGetter: ({ data }) => data!.sell?.optionWatchlistData.bestSellPrice ?? 0,
						valueFormatter: ({ value }) => sepNumbers(String(value)),
						comparator: (valueA, valueB) => valueA - valueB,
					},

					{
						headerName: 'وضعیت',
						colId: 'iotm-sell',
						width: 96,
						cellClass: ({ value }) => {
							switch (value.toLowerCase()) {
								case 'itm':
									return 'text-success-100';
								case 'otm':
									return 'text-error-100';
								case 'atm':
									return 'text-secondary-300';
								default:
									return '';
							}
						},
						valueGetter: ({ data }) => data!.sell?.optionWatchlistData.iotm,
						comparator: (valueA, valueB) => valueA.localeCompare(valueB),
					},

					{
						headerName: 'موقعیت‌های باز',
						colId: 'openPositionCount-sell',
						width: 144,
						valueGetter: ({ data }) => data!.sell?.optionWatchlistData.openPositionCount ?? 0,
						valueFormatter: ({ value }) => sepNumbers(String(value)),
						comparator: (valueA, valueB) => valueA - valueB,
					},

					{
						headerName: 'ارزش روز',
						colId: 'tradeValue-sell',
						width: 120,
						valueGetter: ({ data }) => data!.sell?.optionWatchlistData.tradeValue ?? 0,
						valueFormatter: ({ value }) => sepNumbers(String(value)),
						comparator: (valueA, valueB) => valueA - valueB,
					},

					{
						headerName: 'نماد',
						colId: 'symbolTitle-sell',
						cellClass: 'cursor-pointer',
						width: 144,
						onCellClicked: (api) => onSymbolTitleClicked(api, 'sell'),
						valueGetter: ({ data }) => data!.sell?.symbolInfo.symbolTitle ?? '−',
						comparator: (valueA, valueB) => valueA.localeCompare(valueB),
					},
				],
			},
		],
		[],
	);

	const defaultColDef: ColDef<ITableData> = useMemo(
		() => ({
			suppressMovable: true,
			sortable: true,
			resizable: false,
			flex: 0,
		}),
		[],
	);

	const modifiedData: ITableData[] = useMemo(() => {
		if (!Array.isArray(watchlistData)) return [];

		const dataAsArray: ITableData[] = [];

		try {
			const dataObject: Record<string | number, Partial<Record<'buy' | 'sell', Option.Root>>> = {};

			for (let i = 0; i < watchlistData.length; i++) {
				const item = watchlistData[i];
				const { strikePrice, optionType } = item.symbolInfo;

				if (dataObject?.[strikePrice] === undefined) dataObject[strikePrice] = {};

				dataObject[strikePrice][optionType === 'Put' ? 'sell' : 'buy'] = item;
			}

			const strikePrices = Object.keys(dataObject);
			for (let i = 0; i < strikePrices.length; i++) {
				const strikePrice = strikePrices[i];
				const item = dataObject[strikePrice];

				dataAsArray.push({
					strikePrice: String(strikePrice),
					buy: item?.buy,
					sell: item?.sell,
				});
			}
		} catch (e) {
			//
		}

		return dataAsArray.filter((row) => row.buy !== undefined && row.sell !== undefined);
	}, [watchlistData]);

	useEffect(() => {
		const gridApi = gridRef.current;
		if (!gridApi) return;

		const column = gridApi.getColumn('strikePrice');
		if (!column) return;

		column.setColDef(strikePriceColumn, strikePriceColumn, 'api');
	}, [strikePriceColumn]);

	useEffect(() => {
		const eGrid = gridRef.current;
		if (!eGrid || !Array.isArray(optionChainColumns)) return;

		try {
			for (let i = 0; i < optionChainColumns.length; i++) {
				const { hidden, id } = optionChainColumns[i];
				eGrid.setColumnsVisible([id, `${id}-buy`, `${id}-sell`], !hidden);
			}
		} catch (e) {
			//
		}
	}, [optionChainColumns]);

	useEffect(() => {
		const sub = lightStreamInstance.subscribe({
			mode: 'MERGE',
			items: symbolsISIN,
			fields: ['bestBuyLimitPrice_1', 'bestSellLimitPrice_1', 'openPositionCount', 'totalTradeValue'],
			dataAdapter: 'RamandRLCDData',
			snapshot: true,
		});

		sub.addEventListener('onItemUpdate', onSymbolUpdate);
		sub.start();

		subscribe(sub);
	}, [symbolsISIN.join(',')]);

	return (
		<>
			<AgTable<ITableData>
				gridId='option-chain'
				ref={gridRef}
				className='flex-1 rounded-0'
				rowData={modifiedData}
				columnDefs={COLUMNS}
				onCellMouseOver={(e) => setActiveRowId(e.node.rowIndex ?? -1)}
				onCellMouseOut={() => setActiveRowId(-1)}
				suppressRowVirtualisation
				suppressColumnVirtualisation
				defaultColDef={defaultColDef}
			/>

			{isLoading && (
				<div className='absolute left-0 top-0 size-full bg-white darkness:bg-gray-50'>
					<Loading />
				</div>
			)}

			{!isLoading && (!Array.isArray(watchlistData) || watchlistData.length === 0) && (
				<div className='absolute left-0 top-0 size-full bg-white darkness:bg-gray-50'>
					<NoData />
				</div>
			)}
		</>
	);
};

export default OptionTable;
