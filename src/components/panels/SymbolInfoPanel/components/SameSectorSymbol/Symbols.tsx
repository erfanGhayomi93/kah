import { useSameSectorSymbolsQuery } from '@/api/queries/symbolQuery';
import AgTable from '@/components/common/Tables/AgTable';
import { numFormatter, sepNumbers } from '@/utils/helpers';
import { type ColDef, type GridApi } from '@ag-grid-community/core';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef } from 'react';
import Loading from '../../common/Loading';
import NoData from '../../common/NoData';
import CoGroupSymbolCompare from './components/CoGroupSymbolCompare';
import CoGroupSymbolCompareHeader from './components/CoGroupSymbolCompareHeader';

interface SymbolsProps {
	symbolISIN: string;
}

const Symbols = ({ symbolISIN }: SymbolsProps) => {
	const t = useTranslations();

	const gridRef = useRef<GridApi<Symbol.SameSector>>(null);

	const { data, isLoading } = useSameSectorSymbolsQuery({
		queryKey: ['sameSectorSymbolsQuery', symbolISIN],
	});

	const COLUMNS = useMemo<Array<ColDef<Symbol.SameSector>>>(
		() => [
			/* نماد */
			{
				headerName: t('same_sector_symbol.symbol'),
				colId: 'symbolTitle',
				headerClass: 'text-sm',
				cellClass: 'justify-end',
				sortable: false,
				flex: 2,
				minWidth: 64,
				valueGetter: ({ data }) => data!.symbolTitle ?? '−',
			},

			/* حجم */
			{
				headerName: t('same_sector_symbol.volume'),
				colId: 'totalNumberOfSharesTraded',
				headerClass: 'text-sm',
				cellClass: 'flex items-center justify-center ltr',
				initialSort: 'desc',
				flex: 1,
				minWidth: 88,
				valueGetter: ({ data }) => data!.totalNumberOfSharesTraded ?? 0,
				valueFormatter: (data) => {
					if (!data) return '-';

					const value = data.value;
					return value > 1e7 ? String(numFormatter(value)) : sepNumbers(String(value));
				},
			},

			/* آخرین قیمت/درصد تغییر */
			{
				colId: 'lastTradedPrice',
				headerName: t('same_sector_symbol.last_traded_price'),
				headerComponent: CoGroupSymbolCompareHeader,
				cellRenderer: CoGroupSymbolCompare,
				minWidth: 96,
				valueGetter: ({ data }) => data!.lastTradedPrice ?? 0,
				headerComponentParams: {
					top: t('same_sector_symbol.last_traded_price'),
					bottom: t('same_sector_symbol.last_traded_price_percent'),
				},
				cellRendererParams: {
					top: (data: Symbol.SameSector) => sepNumbers(String(data.lastTradedPrice ?? 0)),
					bottom: (data: Symbol.SameSector) =>
						`${isNaN(data?.lastTradedPriceVarPercent) ? 0 : data.lastTradedPriceVarPercent.toFixed(2)}%`,
					topClass: () => undefined,
					bottomClass: (data: Symbol.SameSector) =>
						data?.lastTradedPriceVarPercent >= 0 ? 'text-success-100' : 'text-error-100',
				},
			},

			/* عرضه/تقاضا */
			{
				headerName: t('same_sector_symbol.supply'),
				colId: 'bestLimitPrice',
				headerComponent: CoGroupSymbolCompareHeader,
				cellRenderer: CoGroupSymbolCompare,
				sortable: false,
				minWidth: 96,
				headerComponentParams: {
					top: t('same_sector_symbol.demand'),
					bottom: t('same_sector_symbol.supply'),
				},
				cellRendererParams: {
					top: (data: Symbol.SameSector) => sepNumbers(String(data?.bestBuyLimitPrice_1 ?? 0)),
					bottom: (data: Symbol.SameSector) => sepNumbers(String(data?.bestSellLimitPrice_1 ?? 0)),
					topClass: () => 'text-success-100',
					bottomClass: () => 'text-error-100',
				},
			},
		],
		[],
	);

	useEffect(() => {
		const gridApi = gridRef.current;
		if (!gridApi) return;

		try {
			gridApi.setGridOption('rowData', data);
		} catch (e) {
			//
		}
	}, [data]);

	if (isLoading) return <Loading />;

	if (!Array.isArray(data) || data.length === 0) return <NoData />;

	return (
		<AgTable
			className='transparent-header h-full rounded-0 border-0'
			columnDefs={COLUMNS}
			rowData={data ?? []}
			getRowId={({ data }) => data.symbolISIN}
			headerHeight={48}
			rowHeight={48}
			defaultColDef={{
				flex: 1,
				sortable: true,
				resizable: false,
			}}
		/>
	);
};

export default Symbols;
