import { useTranslations } from 'next-intl';

interface OpenPositionsInputProps {
	value: ICoveredCallFiltersModalStates['openPositions'];
	onChange: (v: number | null) => void;
}

const OpenPositionsInput = ({ value, onChange }: OpenPositionsInputProps) => {
	const t = useTranslations('strategy_filters');

	return <div />;
};

export default OpenPositionsInput;
