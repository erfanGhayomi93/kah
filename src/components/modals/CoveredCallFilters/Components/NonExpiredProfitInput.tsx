import { useTranslations } from 'next-intl';

interface NonExpiredProfitInputProps {
	value: ICoveredCallFiltersModalStates['nonExpiredProfit'];
	onChange: (v: ICoveredCallFiltersModalStates['nonExpiredProfit']) => void;
}

const NonExpiredProfitInput = ({ value, onChange }: NonExpiredProfitInputProps) => {
	const t = useTranslations('strategy_filters');

	return <div />;
};

export default NonExpiredProfitInput;
