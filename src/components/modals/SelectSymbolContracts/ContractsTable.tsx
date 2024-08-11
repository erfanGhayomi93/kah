import { useWatchlistBySettlementDateQuery } from '@/api/queries/optionQueries';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import AgTable from '@/components/common/Tables/AgTable';
import { type ITableData } from '@/components/pages/OptionChain/Option/OptionTable';
import { sepNumbers } from '@/utils/helpers';
import { type CellClickedEvent, type ColDef, type ColGroupDef, type GridApi } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import CellSymbolTitleRenderer from './TableComponents/CellSymbolTitleRenderer';
import StrikePriceCellRenderer from './TableComponents/StrikePriceCellRenderer';

interface ContractsTableProps {
	symbolISIN?: string;
	maxContractsLength?: number;
	suppressRowActions: boolean;
	isPending: boolean;
	isFetchingInitialContracts: boolean;
	settlementDay: Option.BaseSettlementDays | null;
	contracts: ISelectedContract[];
	setContracts: (v: ISelectedContract[]) => void;
}

const ContractsTable = ({
	symbolISIN,
	isPending,
	isFetchingInitialContracts,
	settlementDay,
	contracts = [],
	maxContractsLength,
	suppressRowActions,
	setContracts,
}: ContractsTableProps) => {
	const t = useTranslations();

	const checkedRef = useRef<boolean>(false);

	const gridRef = useRef<GridApi<ITableData>>(null);

	const [activeRowId, setActiveRowId] = useState<number>(-1);

	const { data: watchlistData, isFetching } = useWatchlistBySettlementDateQuery({
		queryKey: [
			'watchlistBySettlementDateQuery',
			{ baseSymbolISIN: symbolISIN ?? '', settlementDate: settlementDay?.contractEndDate ?? '' },
		],
		enabled: settlementDay !== null && Boolean(symbolISIN),
	});

	const toggleContract = (c: Option.Root, side: TBsSides) => {
		const newContracts = JSON.parse(JSON.stringify(contracts)) as typeof contracts;
		const index = newContracts.findIndex((item) => item.symbolInfo.symbolISIN === c.symbolInfo.symbolISIN);

		if (index > -1) {
			if (suppressRowActions) {
				newContracts.splice(index, 1);
			} else {
				newContracts[index].side = side;
				setContracts(newContracts);
			}
		} else {
			newContracts.push({
				...c,
				side,
			});
		}

		if (typeof maxContractsLength === 'number') {
			const addableContractsLength = maxContractsLength - newContracts.length;

			if (addableContractsLength < 0) {
				toast.error(t('alerts.can_not_add_contracts'), {
					toastId: 'can_not_add_contracts',
				});
				return;
			}
		}

		setContracts(newContracts);
	};

	const onCellClicked = (e: CellClickedEvent<ITableData>) => {
		if (isPending) return;

		try {
			const colId = e.column.getColId();
			const side = colId.split('-')[1];

			const data = e.data![side === 'sell' ? 'sell' : 'buy'];
			if (data) toggleContract(data, 'buy');
		} catch (e) {
			//
		}
	};

	const isContractSelected = useCallback(
		(symbolISIN: string) => {
			return contracts.findIndex((item) => item.symbolInfo.symbolISIN === symbolISIN) > -1;
		},
		[contracts],
	);

	const strikePriceColumn = useMemo<ColDef<ITableData>>(
		() => ({
			headerName: 'اعمال',
			colId: 'strikePrice',
			flex: 1,
			cellClass: 'strike-price',
			headerClass: 'strike-price',
			resizable: false,
			valueGetter: ({ data }) => data!.buy?.symbolInfo.strikePrice ?? 0,
			valueFormatter: ({ value }) => sepNumbers(String(value)),
			cellRenderer: suppressRowActions ? undefined : StrikePriceCellRenderer,
			cellRendererParams: suppressRowActions
				? undefined
				: {
						activeRowId,
						disabled: isPending,
						buy: (data: Option.Root) => toggleContract(data, 'buy'),
						sell: (data: Option.Root) => toggleContract(data, 'sell'),
					},
		}),
		[activeRowId, contracts],
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
						minWidth: 144,
						maxWidth: 144,
						valueGetter: ({ data }) => data!.buy,
						cellRenderer: CellSymbolTitleRenderer,
						cellRendererParams: {
							reverse: false,
							checkbox: suppressRowActions,
							disabled: isPending,
							isSelected: isContractSelected,
						},
					},

					{
						headerName: 'موقعیت‌های باز',
						colId: 'openPositionCount-buy',
						maxWidth: 120,
						minWidth: 120,
						valueGetter: ({ data }) => sepNumbers(String(data!.buy?.optionWatchlistData.openPositionCount)),
					},

					{
						headerName: 'بهترین خرید',
						colId: 'bestBuyPrice-buy',
						cellClass: 'text-success-100',
						headerClass: '!p-0',
						maxWidth: 88,
						minWidth: 88,
						valueGetter: ({ data }) => sepNumbers(String(data!.buy?.optionWatchlistData.bestBuyPrice)),
					},

					{
						headerName: 'بهترین فروش',
						colId: 'bestSellPrice-buy',
						cellClass: 'text-error-100',
						headerClass: '!p-0',
						maxWidth: 88,
						minWidth: 88,
						valueGetter: ({ data }) => sepNumbers(String(data!.buy?.optionWatchlistData.bestSellPrice)),
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
						cellClass: 'text-success-100',
						headerClass: '!p-0',
						maxWidth: 88,
						minWidth: 88,
						valueGetter: ({ data }) => sepNumbers(String(data!.sell?.optionWatchlistData.bestBuyPrice)),
					},

					{
						headerName: 'بهترین فروش',
						colId: 'bestSellPrice-sell',
						cellClass: 'text-error-100',
						headerClass: '!p-0',
						maxWidth: 88,
						minWidth: 88,
						valueGetter: ({ data }) => sepNumbers(String(data!.sell?.optionWatchlistData.bestSellPrice)),
					},

					{
						headerName: 'موقعیت‌های باز',
						colId: 'openPositionCount-sell',
						maxWidth: 120,
						minWidth: 120,
						valueGetter: ({ data }) =>
							sepNumbers(String(data!.sell?.optionWatchlistData.openPositionCount)),
					},

					{
						headerName: 'نماد',
						colId: 'symbolTitle-sell',
						minWidth: 144,
						maxWidth: 144,
						cellRenderer: CellSymbolTitleRenderer,
						valueGetter: ({ data }) => data!.sell,
						cellRendererParams: {
							reverse: true,
							checkbox: suppressRowActions,
							disabled: isPending,
							isSelected: isContractSelected,
						},
					},
				],
			},
		],
		[contracts, activeRowId, isPending],
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

		try {
			if (suppressRowActions) gridApi.setGridOption('onCellClicked', onCellClicked);
			gridApi.setGridOption('columnDefs', COLUMNS);
		} catch (e) {
			//
		}
	}, [contracts, isPending]);

	useEffect(() => {
		const gridApi = gridRef.current;
		if (!gridApi) return;

		const column = gridApi.getColumn('strikePrice');
		if (!column) return;

		column.setColDef(strikePriceColumn, strikePriceColumn, 'api');
	}, [strikePriceColumn]);

	useEffect(() => {
		checkedRef.current = false;
	}, [settlementDay]);

	return (
		<div className='relative flex-1'>
			<AgTable<ITableData>
				suppressRowVirtualisation
				suppressColumnVirtualisation
				ref={gridRef}
				className='h-full'
				rowData={modifiedData}
				columnDefs={COLUMNS}
				defaultColDef={defaultColDef}
				onCellMouseOver={(e) => setActiveRowId(e.node.rowIndex ?? -1)}
				onCellMouseOut={() => setActiveRowId(-1)}
			/>

			{!isFetching && (!settlementDay || modifiedData.length === 0) && (
				<div className='absolute left-0 top-0 size-full bg-white darkness:bg-gray-50'>
					<NoData />
				</div>
			)}

			{(isFetching || isFetchingInitialContracts) && (
				<div className='absolute left-0 top-0 size-full bg-white darkness:bg-gray-50'>
					<Loading />
				</div>
			)}
		</div>
	);
};

export default ContractsTable;
