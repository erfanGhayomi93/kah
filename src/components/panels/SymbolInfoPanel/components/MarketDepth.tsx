import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import Section, { type ITabIem } from '../common/Section';

const MarketDepth = () => {
	const t = useTranslations();

	const tabs: ITabIem[] = useMemo(
		() => [
			{
				id: 'market_depth',
				title: t('symbol_info_panel.market_depth'),
			},
		],
		[],
	);

	return (
		<Section defaultActiveTab='market_depth' tabs={tabs}>
			<div className='px-8 py-16' />
		</Section>
	);
};

export default MarketDepth;
