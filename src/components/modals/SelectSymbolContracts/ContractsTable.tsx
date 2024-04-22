import { useWatchlistBySettlementDateQuery } from '@/api/queries/optionQueries';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import AgTable from '@/components/common/Tables/AgTable';
import { type ITableData } from '@/components/pages/OptionChain/Option/OptionTable';
import { sepNumbers } from '@/utils/helpers';
import { type ColDef, type ColGroupDef, type GridApi } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef } from 'react';
import { toast } from 'react-toastify';
import CellSymbolTitleRendererRenderer from './CellSymbolTitleRenderer';

interface ContractsTableProps {
	initialSelectedContracts: string[];
	settlementDay: Option.BaseSettlementDays | null;
	symbolISIN?: string;
	contracts: Option.Root[];
	maxContracts: number | null;
	setContracts: (v: Option.Root[]) => void;
}

const ContractsTable = ({
	initialSelectedContracts,
	symbolISIN,
	settlementDay,
	contracts = [],
	maxContracts,
	setContracts,
}: ContractsTableProps) => {
	const t = useTranslations();

	const contractsRef = useRef(contracts);

	const checkedRef = useRef<boolean>(false);

	const gridRef = useRef<GridApi<ITableData>>(null);

	const { data: watchlistData, isFetching } = useWatchlistBySettlementDateQuery({
		queryKey: [
			'watchlistBySettlementDateQuery',
			{ baseSymbolISIN: symbolISIN ?? '', settlementDate: settlementDay?.contractEndDate ?? '' },
		],
		enabled: settlementDay !== null && Boolean(symbolISIN),
	});

	const toggleContract = (c: Option.Root) => {
		const newContracts = JSON.parse(JSON.stringify(contractsRef.current)) as typeof contracts;
		const index = newContracts.findIndex((item) => item.symbolInfo.symbolISIN === c.symbolInfo.symbolISIN);

		if (index > -1) {
			newContracts.splice(index, 1);
		} else {
			newContracts.push(c);
		}

		if (maxContracts !== null) {
			const addableContractsLength = maxContracts - newContracts.length;

			if (addableContractsLength < 0) {
				toast.error(t('alerts.can_not_add_contracts'), {
					toastId: 'can_not_add_contracts',
				});
				return;
			}
		}

		setContracts(newContracts);
	};

	const isContractSelected = (symbolISIN: string) => {
		return contractsRef.current.findIndex((item) => item.symbolInfo.symbolISIN === symbolISIN) > -1;
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
						minWidth: 132,
						maxWidth: 132,
						cellRenderer: CellSymbolTitleRendererRenderer,
						valueGetter: ({ data }) => data!.buy,
						cellRendererParams: {
							reverse: false,
							isSelected: isContractSelected,
							onSelect: toggleContract,
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
				headerClass: '!bg-white !border-b-0',
				children: [
					{
						headerName: 'اعمال',
						colId: 'strikePrice',
						flex: 1,
						cellClass: 'strike-price',
						headerClass: 'strike-price',
						valueGetter: ({ data }) => data!.buy?.symbolInfo.strikePrice ?? 0,
						valueFormatter: ({ value }) => sepNumbers(String(value)),
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
						minWidth: 132,
						maxWidth: 132,
						cellRenderer: CellSymbolTitleRendererRenderer,
						valueGetter: ({ data }) => data!.sell,
						cellRendererParams: {
							reverse: true,
							isSelected: isContractSelected,
							onSelect: toggleContract,
						},
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

		gridApi.setGridOption('rowData', modifiedData);
	}, [modifiedData]);

	useEffect(() => {
		contractsRef.current = contracts;

		setTimeout(() => {
			const gridApi = gridRef.current;
			if (!gridApi) return;

			gridApi.refreshCells({
				columns: ['symbolTitle-buy', 'symbolTitle-sell'],
				force: true,
			});
		});
	}, [contracts]);

	useEffect(() => {
		checkedRef.current = false;
	}, [settlementDay]);

	useEffect(() => {
		try {
			if (checkedRef.current || !watchlistData?.length) return;

			const initialContracts: Option.Root[] = [];

			for (let i = 0; i < watchlistData.length; i++) {
				const item = watchlistData[i];
				const exists = initialSelectedContracts.find((symbolISIN) => symbolISIN === item.symbolInfo.symbolISIN);

				if (!exists) continue;

				initialContracts.push(item);
			}

			checkedRef.current = true;
			setContracts(initialContracts);
		} catch (e) {
			//
		}
	}, [initialSelectedContracts, watchlistData]);

	return (
		<div className='relative flex-1'>
			<AgTable<ITableData>
				ref={gridRef}
				className='h-full'
				rowData={modifiedData}
				columnDefs={COLUMNS}
				suppressRowVirtualisation
				suppressColumnVirtualisation
				defaultColDef={defaultColDef}
			/>

			{!isFetching && (!settlementDay || modifiedData.length === 0) && (
				<div className='absolute left-0 top-0 size-full bg-white'>
					<NoData />
				</div>
			)}

			{isFetching && (
				<div className='absolute left-0 top-0 size-full bg-white'>
					<Loading />
				</div>
			)}
		</div>
	);
};

export default ContractsTable;
