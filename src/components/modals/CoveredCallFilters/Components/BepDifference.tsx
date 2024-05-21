import InputLegend from '@/components/common/Inputs/InputLegend';
import { convertStringToInteger } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { Prefix } from './Input';

interface BepDifferenceProps {
	value: ICoveredCallFiltersModalStates['bepDifference'];
	onChange: (v: ICoveredCallFiltersModalStates['bepDifference']) => void;
}

const BepDifference = ({ value, onChange }: BepDifferenceProps) => {
	const t = useTranslations('strategy_filters');

	return (
		<div className='flex gap-8'>
			<InputLegend
				value={value[0]}
				onChange={(v) => {
					const newValue = convertStringToInteger(v);
					onChange([newValue === '' ? null : Number(newValue), value[1]]);
				}}
				placeholder={t('from')}
				inputPlaceholder={t('first_value')}
				maxLength={16}
				prefix={<Prefix />}
				className='size-full bg-transparent px-8 text-left ltr placeholder:text-right'
				separator={false}
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
				className='size-full bg-transparent px-8 text-left ltr placeholder:text-right'
				prefix={<Prefix />}
				separator={false}
				autoTranslateLegend
			/>
		</div>
	);
};

export default BepDifference;
