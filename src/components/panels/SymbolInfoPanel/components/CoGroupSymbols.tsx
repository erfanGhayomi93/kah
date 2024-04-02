import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
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
			<div className='px-8 py-16' />
		</Section>
	);
};

export default CoGroupSymbols;
