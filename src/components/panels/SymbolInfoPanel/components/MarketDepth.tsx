import SymbolMarketDepth from '@/components/common/Tables/SymbolMarketDepth';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import Section, { type ITabIem } from '../common/Section';

interface MarketDepthProps {
	symbolISIN: string;
	lowThreshold: number;
	highThreshold: number;
	yesterdayClosingPrice: number;
}

const MarketDepth = ({ symbolISIN, lowThreshold, highThreshold, yesterdayClosingPrice }: MarketDepthProps) => {
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
				<SymbolMarketDepth
					length={3}
					symbolISIN={symbolISIN}
					lowThreshold={lowThreshold}
					highThreshold={highThreshold}
					yesterdayClosingPrice={yesterdayClosingPrice}
				/>
			</div>
		</Section>
	);
};

export default MarketDepth;
