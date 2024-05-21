import { useTranslations } from 'next-intl';

interface NonExpiredProfitInputProps {
	value: ICoveredCallFiltersModalStates['nonExpiredProfit'];
	onChange: (v: number | null) => void;
}

const NonExpiredProfitInput = ({ value, onChange }: NonExpiredProfitInputProps) => {
	const t = useTranslations('strategy_filters');

	return <div />;
};

export default NonExpiredProfitInput;
