import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import NoData from '../common/NoData';
import Section, { type ITabIem } from '../common/Section';

const CoGroupSymbols = () => {
	const t = useTranslations();

	const tabs: ITabIem[] = useMemo(
		() => [
			{
				id: 'co_group',
				title: t('symbol_info_panel.co_group'),
			},
		],
		[],
	);

	return (
		<Section defaultActiveTab='co_group' tabs={tabs}>
			<NoData />
		</Section>
	);
};

export default CoGroupSymbols;
