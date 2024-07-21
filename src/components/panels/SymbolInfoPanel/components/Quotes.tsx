import SymbolMarketDepth from '@/components/common/Tables/SymbolMarketDepth';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import Section, { type ITabIem } from '../common/Section';

interface QuotesProps {
	symbolISIN: string;
	lowThreshold: number;
	highThreshold: number;
	yesterdayClosingPrice: number;
}

const Quotes = ({ symbolISIN, lowThreshold, highThreshold, yesterdayClosingPrice }: QuotesProps) => {
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
		<Section name='quotes' defaultActiveTab='5_quotes' tabs={tabs}>
			<div className='px-8 py-16'>
				<SymbolMarketDepth
					yesterdayClosingPrice={yesterdayClosingPrice}
					symbolISIN={symbolISIN}
					lowThreshold={lowThreshold}
					highThreshold={highThreshold}
				/>
			</div>
		</Section>
	);
};

export default Quotes;
