import { useWatchlistBySettlementDateQuery } from '@/api/queries/optionQueries';
import AgTable from '@/components/common/Tables/AgTable';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setMoveSymbolToWatchlistModal } from '@/features/slices/modalSlice';
import { setSymbolInfoPanel } from '@/features/slices/panelSlice';
import { getOrderBasket, setOrderBasket } from '@/features/slices/userSlice';
import { useTradingFeatures } from '@/hooks';
import { convertSymbolWatchlistToSymbolBasket, sepNumbers } from '@/utils/helpers';
import { type CellClickedEvent, type ColDef, type ColGroupDef, type GridApi } from '@ag-grid-community/core';
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

const OptionTable = ({ settlementDay, baseSymbol }: OptionTableProps) => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const basket = useAppSelector(getOrderBasket);

	const gridRef = useRef<GridApi<ITableData>>(null);

	const [activeRowId, setActiveRowId] = useState<number>(-1);

	const { addBuySellModal } = useTradingFeatures();

	const { data: watchlistData } = useWatchlistBySettlementDateQuery({
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
						headerName: 'ارزش',
						colId: 'tradeValue-buy',
						width: 120,
						valueGetter: ({ data }) => sepNumbers(String(data!.buy?.optionWatchlistData.tradeValue)),
					},

					{
						headerName: 'موقعیت‌های باز',
						colId: 'openPositionCount-buy',
						width: 144,
						valueGetter: ({ data }) => sepNumbers(String(data!.buy?.optionWatchlistData.openPositionCount)),
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
					},

					{
						headerName: 'بهترین خرید',
						colId: 'bestBuyPrice-buy',
						flex: 1,
						cellClass: 'text-success-100',
						valueGetter: ({ data }) => sepNumbers(String(data!.buy?.optionWatchlistData.bestBuyPrice)),
					},

					{
						headerName: 'بهترین فروش',
						colId: 'bestSellPrice-buy',
						flex: 1,
						cellClass: 'text-error-100',
						valueGetter: ({ data }) => sepNumbers(String(data!.buy?.optionWatchlistData.bestSellPrice)),
					},
				],
			},

			{
				groupId: 'strike',
				headerName: '',
				headerClass: '!bg-white !border-b-0',
				children: [
					{
						headerName: 'اعمال',
						colId: 'strikePrice',
						minWidth: 132,
						maxWidth: 132,
						resizable: false,
						cellClass: 'strike-price',
						headerClass: 'strike-price',
						valueGetter: ({ data }) => data!.buy?.symbolInfo.strikePrice ?? 0,
						valueFormatter: ({ value }) => sepNumbers(String(value)),
						cellRenderer: StrikePriceCellRenderer,
						cellRendererParams: {
							activeRowId,
							basket: [],
							addSymbolToBasket,
							addSymbolToWatchlist,
							addAlert,
							goToTechnicalChart,
						},
					},
				],
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
						valueGetter: ({ data }) => sepNumbers(String(data!.sell?.optionWatchlistData.bestBuyPrice)),
					},

					{
						headerName: 'بهترین فروش',
						colId: 'bestSellPrice-sell',
						flex: 1,
						cellClass: 'text-error-100',
						valueGetter: ({ data }) => sepNumbers(String(data!.sell?.optionWatchlistData.bestSellPrice)),
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
					},

					{
						headerName: 'موقعیت‌های باز',
						colId: 'openPositionCount-sell',
						width: 144,
						valueGetter: ({ data }) =>
							sepNumbers(String(data!.sell?.optionWatchlistData.openPositionCount)),
					},

					{
						headerName: 'ارزش',
						colId: 'tradeValue-sell',
						width: 120,
						valueGetter: ({ data }) => sepNumbers(String(data!.sell?.optionWatchlistData.tradeValue)),
					},

					{
						headerName: 'نماد',
						colId: 'symbolTitle-sell',
						cellClass: 'cursor-pointer',
						width: 144,
						onCellClicked: (api) => onSymbolTitleClicked(api, 'buy'),
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
		if (!watchlistData) return [];

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

			return dataAsArray;
		} catch (e) {
			return dataAsArray;
		}
	}, [watchlistData]);

	useEffect(() => {
		const gridApi = gridRef.current;
		if (!gridApi) return;

		const column = gridApi.getColumn('strikePrice');
		if (!column) return;

		const colDef: ColDef<ITableData> = {
			headerName: 'اعمال',
			colId: 'strikePrice',
			minWidth: 132,
			maxWidth: 132,
			resizable: false,
			cellClass: 'strike-price',
			headerClass: 'strike-price',
			valueGetter: ({ data }) => data!.buy?.symbolInfo.strikePrice ?? 0,
			valueFormatter: ({ value }) => sepNumbers(String(value)),
			cellRenderer: StrikePriceCellRenderer,
			cellRendererParams: {
				activeRowId,
				basket: basket?.orders ?? [],
				addBuySellModal,
				addSymbolToBasket,
				addSymbolToWatchlist,
				addAlert,
				goToTechnicalChart,
			},
		};

		column.setColDef(colDef, colDef, 'api');
	}, [activeRowId, settlementDay, JSON.stringify(basket?.orders ?? [])]);

	return (
		<AgTable<ITableData>
			gridId='option-chain'
			ref={gridRef}
			className='flex-1 rounded-0'
			rowData={modifiedData ?? []}
			columnDefs={COLUMNS}
			onCellMouseOver={(e) => setActiveRowId(e.node.rowIndex ?? -1)}
			onCellMouseOut={() => setActiveRowId(-1)}
			suppressRowVirtualisation
			suppressColumnVirtualisation
			defaultColDef={defaultColDef}
		/>
	);
};

export default OptionTable;
