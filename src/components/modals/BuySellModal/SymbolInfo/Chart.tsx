import { useSymbolChartDataQuery } from '@/api/queries/symbolQuery';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import SymbolChart from '@/components/common/Symbol/SymbolChart';

interface ChartProps {
	symbolISIN: string;
}

const Chart = ({ symbolISIN }: ChartProps) => {
	const { data, isLoading } = useSymbolChartDataQuery({
		queryKey: ['symbolChartDataQuery', symbolISIN, 'Today'],
	});

	return (
		<div className='relative flex-1 p-8'>
			{isLoading ? (
				<Loading />
			) : !Array.isArray(data) || data.length === 0 ? (
				<NoData />
			) : (
				<SymbolChart data={data ?? []} tab='symbol_chart' type='area' height='256px' />
			)}
		</div>
	);
};

export default Chart;
