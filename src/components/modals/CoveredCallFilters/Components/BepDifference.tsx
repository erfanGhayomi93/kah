import { useTranslations } from 'next-intl';

interface BepDifferenceProps {
	value: ICoveredCallFiltersModalStates['bepDifference'];
	onChange: (v: number | null) => void;
}

const BepDifference = ({ value, onChange }: BepDifferenceProps) => {
	const t = useTranslations('strategy_filters');

	return <div />;
};

export default BepDifference;
