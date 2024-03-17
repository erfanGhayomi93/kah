import { useWatchlistBySettlementDateQuery } from '@/api/queries/optionQueries';
import AgTable from '@/components/common/Tables/AgTable';
import { openNewTab, sepNumbers } from '@/utils/helpers';
import { type CellClickedEvent, type ColDef, type GridApi } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import { useLayoutEffect, useMemo, useRef } from 'react';

interface ITableData {
	strikePrice: string;
	buy?: Option.Root;
	sell?: Option.Root;
}

interface OptionTableProps {
	settlementDay: Option.BaseSettlementDays;
	baseSymbolISIN: string;
}

const OptionTable = ({ settlementDay, baseSymbolISIN }: OptionTableProps) => {
	const t = useTranslations();

	const gridRef = useRef<GridApi<ITableData>>(null);

	const { data: watchlistData } = useWatchlistBySettlementDateQuery({
		queryKey: [
			'watchlistBySettlementDateQuery',
			{ baseSymbolISIN, settlementDate: settlementDay?.contractEndDate },
		],
	});

	const onSymbolTitleClicked = ({ data }: CellClickedEvent<ITableData>, side: 'buy' | 'sell') => {
		try {
			if (!data) return;
			const symbolData = data[side];

			if (!symbolData) return;

			const { symbolISIN, baseSymbolISIN } = symbolData.symbolInfo;

			if (baseSymbolISIN && symbolISIN)
				openNewTab('/fa/saturn', `symbolISIN=${baseSymbolISIN}&contractISIN=${symbolISIN}`);
		} catch (e) {
			//
		}
	};

	const COLUMNS: Array<ColDef<ITableData>> = useMemo(
		() => [
			// * Buy

			{
				headerName: 'نماد',
				colId: 'symbolTitle-buy',
				width: 144,
				pinned: 'right',
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
				headerName: 'بهترین فروش',
				colId: 'bestSellPrice-buy',
				flex: 1,
				cellClass: 'text-error-100',
				valueGetter: ({ data }) => sepNumbers(String(data!.buy?.optionWatchlistData.bestSellPrice)),
			},

			{
				headerName: 'بهترین خرید',
				colId: 'bestBuyPrice-buy',
				flex: 1,
				cellClass: 'text-success-100',
				valueGetter: ({ data }) => sepNumbers(String(data!.buy?.optionWatchlistData.bestBuyPrice)),
			},

			{
				headerName: 'اعمال',
				colId: 'strikePrice',
				minWidth: 132,
				maxWidth: 132,
				cellClass: 'strike-price',
				headerClass: 'strike-price',
				valueGetter: ({ data }) => sepNumbers(String(data!.buy?.symbolInfo.strikePrice)),
			},

			// ! Sell

			{
				headerName: 'بهترین فروش',
				colId: 'bestSellPrice-sell',
				flex: 1,
				cellClass: 'text-error-100',
				valueGetter: ({ data }) => sepNumbers(String(data!.sell?.optionWatchlistData.bestSellPrice)),
			},

			{
				headerName: 'بهترین خرید',
				colId: 'bestBuyPrice-sell',
				flex: 1,
				cellClass: 'text-success-100',
				valueGetter: ({ data }) => sepNumbers(String(data!.sell?.optionWatchlistData.bestBuyPrice)),
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
				valueGetter: ({ data }) => sepNumbers(String(data!.sell?.optionWatchlistData.openPositionCount)),
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
				pinned: 'left',
				onCellClicked: (api) => onSymbolTitleClicked(api, 'buy'),
				valueGetter: ({ data }) => data!.sell?.symbolInfo.symbolTitle ?? '−',
				comparator: (valueA, valueB) => valueA.localeCompare(valueB),
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

	useLayoutEffect(() => {
		const gridApi = gridRef.current;
		if (!gridApi) return;

		try {
			gridApi.setGridOption('rowData', modifiedData);
		} catch (e) {
			//
		}
	}, [modifiedData]);

	return (
		<>
			<div style={{ flex: '0 0 4.8rem' }} className='flex border-b border-b-gray-500 bg-white text-base'>
				<div className='flex-1 bg-success-100/10 flex-justify-center'>
					<span className='text-success-100'>{t('option_chain.call_contracts')}</span>
				</div>
				<div style={{ flex: '0 0 13.2rem' }} />
				<div className='flex-1 bg-error-100/10 flex-justify-center'>
					<span className='text-error-100'>{t('option_chain.put_contracts')}</span>
				</div>
			</div>

			<AgTable<ITableData>
				ref={gridRef}
				className='flex-1 rounded-0'
				rowData={modifiedData ?? []}
				columnDefs={COLUMNS}
				suppressRowVirtualisation
				suppressColumnVirtualisation
				defaultColDef={defaultColDef}
			/>
		</>
	);
};

export default OptionTable;
