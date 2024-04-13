import {
	useGetBaseTopSymbolsQuery,
	useGetOptionTopSymbolsQuery,
	useGetTopSymbolsQuery,
} from '@/api/queries/dashboardQueries';
import Loading from '@/components/common/Loading';
import LightweightTable, { type IColDef } from '@/components/common/Tables/LightweightTable';
import { useMemo } from 'react';

interface TableProps {
	symbolType: Dashboard.TTopSymbols;
	type: Dashboard.TTopSymbolType;
}

const Table = ({ symbolType, type }: TableProps) => {
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
			colId: '',
			headerName: '',
			valueFormatter: (row) => row.symbolTitle,
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
		<div className='relative flex-1'>
			<LightweightTable<Dashboard.GetTopSymbols.All>
				rowData={data}
				columnDefs={columnDefinitions as Array<IColDef<Dashboard.GetTopSymbols.All>>}
				getRowId={(_, index) => index}
			/>

			{isFetching && <Loading />}
		</div>
	);
};

export default Table;
