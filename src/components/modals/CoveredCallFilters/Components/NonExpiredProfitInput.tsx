import { convertStringToInteger, sepNumbers } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import Input, { Prefix } from './Input';

interface NonExpiredProfitInputProps {
	value: ICoveredCallFiltersModalStates['nonExpiredProfit'];
	onChange: (v: ICoveredCallFiltersModalStates['nonExpiredProfit']) => void;
}

const NonExpiredProfitInput = ({ value, onChange }: NonExpiredProfitInputProps) => {
	const t = useTranslations('common');

	const onChangeValue = (newValue: string) => {
		const v = convertStringToInteger(newValue);

		if (v === '') onChange(null);
		else onChange(Number(v));
	};

	return (
		<Input
			type='text'
			value={value === null ? '' : sepNumbers(String(value))}
			onChange={(e) => onChangeValue(e.target.value)}
			maxLength={16}
			prefix={<Prefix />}
		/>
	);
};

export default NonExpiredProfitInput;
