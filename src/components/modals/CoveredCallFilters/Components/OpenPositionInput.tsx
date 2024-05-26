import InputLegend from '@/components/common/Inputs/InputLegend';
import { convertStringToInteger } from '@/utils/helpers';
import { useTranslations } from 'next-intl';

interface OpenPositionInputProps {
	value: ICoveredCallFiltersModalStates['openPosition'];
	onChange: (v: ICoveredCallFiltersModalStates['openPosition']) => void;
}

const OpenPositionInput = ({ value, onChange }: OpenPositionInputProps) => {
	const t = useTranslations('strategy_filters');

	return (
		<div className='flex h-40 w-full gap-8'>
			<InputLegend
				value={value}
				onChange={(v) => {
					const newValue = convertStringToInteger(v);
					onChange(newValue === '' ? null : Number(newValue));
				}}
				inputPlaceholder={t('value')}
				placeholder={t('from')}
				maxLength={16}
				className='h-full flex-1 bg-transparent px-8 text-center ltr'
				autoTranslateLegend
			/>
		</div>
	);
};

export default OpenPositionInput;
