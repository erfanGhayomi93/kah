import { useTranslations } from 'next-intl';

interface MaxProfitInputProps {
	value: ICoveredCallFiltersModalStates['maxProfit'];
	onChange: (v: ICoveredCallFiltersModalStates['maxProfit']) => void;
}

const MaxProfitInput = ({ value, onChange }: MaxProfitInputProps) => {
	const t = useTranslations('strategy_filters');

	return <div />;
};

export default MaxProfitInput;
