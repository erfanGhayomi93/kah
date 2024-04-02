import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
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
			<div className='px-8 py-16' />
		</Section>
	);
};

export default Contracts;
