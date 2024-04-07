import { useSymbolChartDataQuery } from '@/api/queries/symbolQuery';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import Section, { type ITabIem } from '../../common/Section';
import SymbolLinearChart from './SymbolLinearChart';

interface ChartProps {
	symbolISIN: string;
}
const Chart = ({ symbolISIN }: ChartProps) => {
	const t = useTranslations();

	const { data, isFetching } = useSymbolChartDataQuery({
		queryKey: ['symbolChartDataQuery', symbolISIN, 'Today'],
	});

	const tabs: ITabIem[] = useMemo(
		() => [
			{
				id: 'symbol_chart',
				title: t('symbol_info_panel.symbol_chart'),
			},
		],
		[],
	);

	return (
		<Section name='chart' defaultActiveTab='symbol_chart' tabs={tabs}>
			<SymbolLinearChart data={data} isLoading={isFetching} />
		</Section>
	);
};

export default Chart;
