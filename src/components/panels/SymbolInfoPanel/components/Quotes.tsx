import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import Section, { type ITabIem } from '../common/Section';

const Quotes = () => {
	const t = useTranslations();

	const tabs: ITabIem[] = useMemo(
		() => [
			{
				id: '5_quotes',
				title: t('symbol_info_panel.5_quotes'),
			},
		],
		[],
	);

	return (
		<Section defaultActiveTab='5_quotes' tabs={tabs}>
			<div className='px-8 py-16' />
		</Section>
	);
};

export default Quotes;
