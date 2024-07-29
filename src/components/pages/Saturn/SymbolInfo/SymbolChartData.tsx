import { useSymbolChartDataQuery } from '@/api/queries/symbolQuery';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import SymbolChart, { SymbolChartInterval, SymbolChartType } from '@/components/common/Symbol/SymbolChart';
import { dateTypesAPI } from '@/constants';
import { useInputs } from '@/hooks';

interface SymbolChartDataProps {
	symbolISIN: string;
}

const SymbolChartData = ({ symbolISIN }: SymbolChartDataProps) => {
	const { inputs, setFieldValue } = useInputs<Omit<ISymbolChartStates, 'tab'>>({
		interval: 'daily',
		type: 'area',
	});

	const { data, isError, isLoading } = useSymbolChartDataQuery({
		queryKey: ['symbolChartDataQuery', symbolISIN, dateTypesAPI[inputs.interval]],
	});

	if (isLoading) return <Loading />;

	if (!data?.length || isError) return <NoData />;

	return (
		<div className='relative h-full flex-column'>
			<SymbolChart data={data ?? []} interval={inputs.interval} type={inputs.type} tab='symbol_chart' />

			<div style={{ flex: '0 0 2.4rem' }} className='flex-items-center'>
				<SymbolChartInterval activeInterval={inputs.interval} onChange={(v) => setFieldValue('interval', v)} />
				<SymbolChartType type={inputs.type} onChange={(v) => setFieldValue('type', v)} />
			</div>

			{isLoading && (
				<div className='darkBlue:bg-gray-50 absolute left-0 top-0 size-full bg-white dark:bg-gray-50'>
					<Loading />
				</div>
			)}
		</div>
	);
};

export default SymbolChartData;
