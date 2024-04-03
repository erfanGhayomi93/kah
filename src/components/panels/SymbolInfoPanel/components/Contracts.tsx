import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import NoData from '../common/NoData';
import Section, { type ITabIem } from '../common/Section';

const Contracts = () => {
	const t = useTranslations();

	const tabs: ITabIem[] = useMemo(
		() => [
			{
				id: 'contracts',
				title: t('symbol_info_panel.contracts'),
			},
		],
		[],
	);

	return (
		<Section defaultActiveTab='contracts' tabs={tabs}>
			<NoData />
		</Section>
	);
};

export default Contracts;
