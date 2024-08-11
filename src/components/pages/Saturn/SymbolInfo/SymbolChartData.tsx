import { useOpenPositionChartDataQuery } from '@/api/queries/optionQueries';
import { useSymbolChartDataQuery } from '@/api/queries/symbolQuery';
import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import SymbolChart, { SymbolChartInterval, SymbolChartType } from '@/components/common/Symbol/SymbolChart';
import { dateTypesAPI } from '@/constants';
import { useInputs } from '@/hooks';

interface SymbolChartDataProps {
	symbolISIN: string;
	tab: 'symbol_chart' | 'open_positions';
}

const SymbolChartData = ({ symbolISIN, tab }: SymbolChartDataProps) => {
	const { inputs, setFieldValue } = useInputs<Omit<ISymbolChartStates, 'tab'>>({
		interval: 'daily',
		type: 'area',
	});

	const {
		data: ohlcData = [],
		isError,
		isLoading: isOHLCLoading,
	} = useSymbolChartDataQuery({
		queryKey: ['symbolChartDataQuery', symbolISIN, dateTypesAPI[inputs.interval]],
		enabled: tab === 'symbol_chart',
	});

	const { data: optionOpenPositionData = [], isLoading: isOpenPositionChartLoading } = useOpenPositionChartDataQuery({
		queryKey: ['openPositionChartDataQuery', symbolISIN, dateTypesAPI[inputs.interval]],
		enabled: tab === 'open_positions',
	});

	const data = tab === 'open_positions' ? optionOpenPositionData : ohlcData;

	if (isOHLCLoading || isOpenPositionChartLoading) return <Loading />;

	if (!data.length || isError) return <NoData />;

	return (
		<div className='relative h-full flex-column'>
			{/* @ts-expect-error: Typescript can not detect "chartData" type based on input.tab, It's working fine */}
			<SymbolChart data={data} interval={inputs.interval} type={inputs.type} tab={tab} />

			<div style={{ flex: '0 0 2.4rem' }} className='flex-items-center'>
				<SymbolChartInterval activeInterval={inputs.interval} onChange={(v) => setFieldValue('interval', v)} />
				<SymbolChartType type={inputs.type} onChange={(v) => setFieldValue('type', v)} />
			</div>
		</div>
	);
};

export default SymbolChartData;
