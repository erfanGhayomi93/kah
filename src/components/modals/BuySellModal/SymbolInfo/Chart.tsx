import { useSymbolChartDataQuery } from '@/api/queries/symbolQuery';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import SymbolLinearChart from '@/components/common/Symbol/SymbolLinearChart';

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
				<SymbolLinearChart data={data ?? []} height='256px' />
			)}
		</div>
	);
};

export default Chart;
