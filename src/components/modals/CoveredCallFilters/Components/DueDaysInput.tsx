import InputLegend from '@/components/common/Inputs/InputLegend';
import { convertStringToInteger } from '@/utils/helpers';
import { useTranslations } from 'next-intl';

interface DueDaysInputProps {
	value: ICoveredCallFiltersModalStates['dueDays'];
	onChange: (v: ICoveredCallFiltersModalStates['dueDays']) => void;
}

const DueDaysInput = ({ value, onChange }: DueDaysInputProps) => {
	const t = useTranslations('strategy_filters');

	return (
		<div className='flex h-40 w-full gap-8'>
			<InputLegend
				value={value[0]}
				onChange={(v) => {
					const newValue = convertStringToInteger(v);
					onChange([newValue === '' ? null : Number(newValue), value[1]]);
				}}
				placeholder={t('from')}
				inputPlaceholder={t('first_value')}
				maxLength={16}
				className='h-full flex-1 bg-transparent px-8 text-center ltr'
				autoTranslateLegend
			/>

			<InputLegend
				value={value[1]}
				onChange={(v) => {
					const newValue = convertStringToInteger(v);
					onChange([value[0], v === '' ? null : Number(newValue)]);
				}}
				placeholder={t('to')}
				inputPlaceholder={t('seconds_value')}
				maxLength={16}
				className='h-full flex-1 bg-transparent px-8 text-center ltr'
				autoTranslateLegend
			/>
		</div>
	);
};

export default DueDaysInput;
