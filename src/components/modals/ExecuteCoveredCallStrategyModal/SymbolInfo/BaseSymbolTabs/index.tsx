import Loading from '@/components/common/Loading';
import NoData from '@/components/common/NoData';
import Grid from './Grid';

interface BaseSymbolTabsProps {
	symbolData: Symbol.Info | null;
	isLoading: boolean;
}

const BaseSymbolTabs = ({ symbolData, isLoading }: BaseSymbolTabsProps) => {
	if (isLoading) return <Loading />;

	if (!symbolData) return <NoData />;

	const { symbolISIN, lowThreshold, highThreshold } = symbolData;

	return (
		<Grid
			symbolISIN={symbolISIN}
			lowThreshold={lowThreshold}
			highThreshold={highThreshold}
			yesterdayClosingPrice={symbolData.yesterdayClosingPrice}
		/>
	);
};

export default BaseSymbolTabs;
