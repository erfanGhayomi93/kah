import { useTranslations } from 'next-intl';

interface DueDaysInputProps {
	value: ICoveredCallFiltersModalStates['dueDays'];
	onChange: (v: number | null) => void;
}

const DueDaysInput = ({ value, onChange }: DueDaysInputProps) => {
	const t = useTranslations('strategy_filters');

	return <div />;
};

export default DueDaysInput;
