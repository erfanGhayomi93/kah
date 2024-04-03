import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import NoData from '../common/NoData';
import Section, { type ITabIem } from '../common/Section';

const Chart = () => {
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
		<Section defaultActiveTab='symbol_chart' tabs={tabs}>
			<NoData />
		</Section>
	);
};

export default Chart;
