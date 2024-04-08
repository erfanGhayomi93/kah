import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import SymbolLinearChart from '../../../../common/Symbol/SymbolLinearChart';
import Section, { type ITabIem } from '../../common/Section';

interface ChartProps {
	symbolISIN: string;
}
const Chart = ({ symbolISIN }: ChartProps) => {
	const t = useTranslations();

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
			<SymbolLinearChart symbolISIN={symbolISIN} height='26.4rem' />
		</Section>
	);
};

export default Chart;
