import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import Section, { type ITabIem } from '../common/Section';

const SymbolDetail = () => {
	const t = useTranslations();

	const tabs: ITabIem[] = useMemo(
		() => [
			{
				id: 'symbol_detail',
				title: t('symbol_info_panel.symbol_detail'),
			},
		],
		[],
	);

	return (
		<Section defaultActiveTab='symbol_detail' tabs={tabs}>
			<div className='px-8 py-16' />
		</Section>
	);
};

export default SymbolDetail;
