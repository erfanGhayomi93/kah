import { useWatchlistBySettlementDateQuery } from '@/api/queries/optionQueries';
import Loading from '@/components/common/Loading';
import AgTable from '@/components/common/Tables/AgTable';
import { sepNumbers } from '@/utils/helpers';
import { type ColDef } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import NoData from '../common/NoData';

interface TableProps {
	baseSymbolISIN: string;
	contractEndDate: string;
	expanding: boolean;
}

interface ITableData {
	strikePrice: string;
	buy?: Option.Root;
	sell?: Option.Root;
}

const Table = ({ baseSymbolISIN, contractEndDate, expanding }: TableProps) => {
	const t = useTranslations();

	const { data: watchlistData, isLoading } = useWatchlistBySettlementDateQuery({
		queryKey: ['watchlistBySettlementDateQuery', { baseSymbolISIN, settlementDate: contractEndDate }],
	});

	const modifiedData: ITableData[] = useMemo(() => {
		if (!watchlistData) return [];

		const dataAsArray: ITableData[] = [];

		try {
			const dataObject: Record<string | number, Partial<Record<'buy' | 'sell', Option.Root>>> = {};

			for (let i = 0; i < watchlistData.length; i++) {
				const item = watchlistData[i];
				const { strikePrice, type } = item.symbolInfo;

				if (!(strikePrice in item)) dataObject[strikePrice] = {};

				if (type === 'Call') dataObject[strikePrice].buy = item;
				else if (type === 'Put') dataObject[strikePrice].sell = item;
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

	const COLUMNS: Array<ColDef<ITableData>> = useMemo(
		() => [
			// Buy

			{
				headerName: 'نماد',
				colId: 'symbolTitle-buy',
				minWidth: 128,
				valueGetter: ({ data }) => data!.buy?.symbolInfo.symbolTitle,
				comparator: (valueA, valueB) => valueA.localeCompare(valueB),
			},

			{
				headerName: 'ارزش',
				colId: 'tradeValue-buy',
				minWidth: 112,
				valueGetter: ({ data }) => sepNumbers(String(data!.buy?.optionWatchlistData.tradeValue)),
			},

			{
				headerName: 'موقعیت‌های باز',
				colId: 'openPositionCount-buy',
				minWidth: 120,
				valueGetter: ({ data }) => sepNumbers(String(data!.buy?.optionWatchlistData.openPositionCount)),
			},

			{
				headerName: 'وضعیت',
				colId: 'iotm-buy',
				minWidth: 56,
				cellClass: ({ value }) => {
					switch (value?.toLowerCase()) {
						case 'atm':
							return 'text-lg text-success-100';
						case 'otm':
							return 'text-lg text-error-100';
						case 'itm':
							return 'text-lg text-primary-100';
						default:
							return '−';
					}
				},
				valueGetter: ({ data }) => data!.buy?.optionWatchlistData.iotm,
			},

			{
				headerName: 'بهترین خرید',
				colId: 'bestBuyPrice-buy',
				minWidth: 96,
				cellStyle: {
					backgroundColor: 'rgba(25, 135, 84, 0.1)',
				},
				valueGetter: ({ data }) => sepNumbers(String(data!.buy?.optionWatchlistData.bestBuyPrice)),
			},

			{
				headerName: 'بهترین فروش',
				colId: 'bestSellPrice-buy',
				minWidth: 96,
				cellStyle: {
					backgroundColor: 'rgba(220, 53, 69, 0.1)',
				},
				valueGetter: ({ data }) => sepNumbers(String(data!.buy?.optionWatchlistData.bestSellPrice)),
			},

			{
				headerName: 'اعمال',
				colId: 'strikePrice',
				minWidth: 96,
				headerClass: 'bg-link-100',
				cellClass: 'bg-link-100',
				valueGetter: ({ data }) => sepNumbers(String(data!.buy?.symbolInfo.strikePrice)),
			},

			// Sell

			{
				headerName: 'بهترین فروش',
				colId: 'bestSellPrice-sell',
				minWidth: 96,
				cellStyle: {
					backgroundColor: 'rgba(220, 53, 69, 0.1)',
				},
				valueGetter: ({ data }) => sepNumbers(String(data!.sell?.optionWatchlistData.bestSellPrice)),
			},

			{
				headerName: 'بهترین خرید',
				colId: 'bestBuyPrice-sell',
				minWidth: 96,
				cellStyle: {
					backgroundColor: 'rgba(25, 135, 84, 0.1)',
				},
				valueGetter: ({ data }) => sepNumbers(String(data!.sell?.optionWatchlistData.bestBuyPrice)),
			},

			{
				headerName: 'وضعیت',
				colId: 'iotm-sell',
				minWidth: 56,
				cellClass: ({ value }) => {
					switch (value?.toLowerCase()) {
						case 'atm':
							return 'text-lg text-success-100';
						case 'otm':
							return 'text-lg text-error-100';
						case 'itm':
							return 'text-lg text-primary-100';
						default:
							return '−';
					}
				},
				valueGetter: ({ data }) => data!.sell?.optionWatchlistData.iotm,
			},

			{
				headerName: 'موقعیت‌های باز',
				colId: 'openPositionCount-sell',
				minWidth: 120,
				valueGetter: ({ data }) => sepNumbers(String(data!.sell?.optionWatchlistData.openPositionCount)),
			},

			{
				headerName: 'ارزش',
				colId: 'tradeValue-sell',
				minWidth: 112,
				valueGetter: ({ data }) => sepNumbers(String(data!.sell?.optionWatchlistData.tradeValue)),
			},

			{
				headerName: 'نماد',
				colId: 'symbolTitle-sell',
				minWidth: 128,
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
			flex: 1,
		}),
		[],
	);

	if (isLoading || expanding) return <Loading />;

	if (!Array.isArray(watchlistData) || watchlistData.length === 0)
		return <NoData text={t('option_chain.no_contract_found')} />;

	return (
		<div className='w-full flex-column'>
			<div className='flex h-48'>
				<div className='bg-link-100 flex-1 text-lg font-medium text-gray-100 flex-justify-center'>
					{t('option_chain.buy_contracts')}
				</div>
				<div className='bg-link-100 flex-1 text-lg font-medium text-gray-100 flex-justify-center'>
					{t('option_chain.sell_contracts')}
				</div>
			</div>

			<div style={{ height: (watchlistData.length + 1) * 48, maxHeight: '44rem' }}>
				<AgTable
					className='h-full'
					rowData={modifiedData ?? []}
					columnDefs={COLUMNS}
					defaultColDef={defaultColDef}
					getRowId={({ data }) => data!.strikePrice}
				/>
			</div>
		</div>
	);
};

export default Table;
