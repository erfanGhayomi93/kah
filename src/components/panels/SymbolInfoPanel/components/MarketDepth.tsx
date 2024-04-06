import SymbolPriceTable from '@/components/common/Tables/SymbolPriceTable';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import Section, { type ITabIem } from '../common/Section';

interface MarketDepthProps {
	symbolISIN: string;
}

const MarketDepth = ({ symbolISIN }: MarketDepthProps) => {
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
		<Section name='market_depth' defaultActiveTab='market_depth' tabs={tabs}>
			<div className='px-8 py-16'>
				<SymbolPriceTable length={3} symbolISIN={symbolISIN} />
			</div>
		</Section>
	);
};

export default MarketDepth;
