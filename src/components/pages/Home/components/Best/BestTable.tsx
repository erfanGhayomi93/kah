import {
	useGetBaseTopSymbolsQuery,
	useGetOptionTopSymbolsQuery,
	useGetTopSymbolsQuery,
} from '@/api/queries/dashboardQueries';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { useMemo } from 'react';

interface TableProps {
	symbolType: Dashboard.TTopSymbols;
	type: Dashboard.TTopSymbolType;
}

const BestTable = ({ symbolType, type }: TableProps) => {
	const { data: optionTopSymbolsData, isFetching: isFetchingOptionTopSymbols } = useGetOptionTopSymbolsQuery({
		queryKey: ['getOptionTopSymbolsQuery', type as Dashboard.GetTopSymbols.Option.Type],
		enabled: symbolType === 'Option',
	});

	const { data: baseTopSymbolsData, isFetching: isFetchingBaseTopSymbolsData } = useGetBaseTopSymbolsQuery({
		queryKey: ['getBaseTopSymbolsQuery', type as Dashboard.GetTopSymbols.BaseSymbol.Type],
		enabled: symbolType === 'BaseSymbol',
	});

	const { data: topSymbolsData, isFetching: isFetchingTopSymbolsData } = useGetTopSymbolsQuery({
		queryKey: ['getTopSymbolsQuery', type as Dashboard.GetTopSymbols.Symbol.Type],
		enabled: symbolType === 'Symbol',
	});

	const getOptionColDefs = (): Array<IColDef<Dashboard.GetTopSymbols.Option.All>> => [
		{
			colId: '1',
			headerName: 'نماد',
			valueFormatter: (row) => 'ضخود0119',
		},
		{
			colId: '2',
			headerName: 'ارزش',
			valueFormatter: (row) => '7,000,000',
		},
		{
			colId: '3',
			headerName: 'آخرین قیمت',
			valueFormatter: (row) => '7,700',
		},
		{
			colId: '4',
			headerName: 'مانده تا سر رسید (روز)',
			valueFormatter: (row) => '27',
		},
	];

	const getBaseSymbolColDefs = (): Array<IColDef<Dashboard.GetTopSymbols.BaseSymbol.All>> => [];

	const getSymbolColDefs = (): Array<IColDef<Dashboard.GetTopSymbols.Symbol.All>> => [];

	const columnDefinitions:
		| Array<IColDef<Dashboard.GetTopSymbols.Symbol.All>>
		| Array<IColDef<Dashboard.GetTopSymbols.BaseSymbol.All>>
		| Array<IColDef<Dashboard.GetTopSymbols.Option.All>> = useMemo(() => {
		if (symbolType === 'Option') return getOptionColDefs();

		if (symbolType === 'BaseSymbol') return getBaseSymbolColDefs();

		return getSymbolColDefs();
	}, [symbolType]);

	const [data, isFetching]: [Dashboard.GetTopSymbols.AllAsArray, boolean] =
		symbolType === 'Option'
			? [optionTopSymbolsData ?? [], isFetchingOptionTopSymbols]
			: symbolType === 'BaseSymbol'
				? [baseTopSymbolsData ?? [], isFetchingBaseTopSymbolsData]
				: [topSymbolsData ?? [], isFetchingTopSymbolsData];

	return (
		<div className='relative h-full'>
			{isFetching ? (
				<Loading />
			) : data.length > 0 ? (
				<LightweightTable<Dashboard.GetTopSymbols.All>
					rowData={data}
					columnDefs={columnDefinitions as Array<IColDef<Dashboard.GetTopSymbols.All>>}
					getRowId={(_, index) => index}
				/>
			) : (
				<NoData />
			)}
		</div>
	);
};

export default BestTable;
