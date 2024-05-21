import InputLegend from '@/components/common/Inputs/InputLegend';
import { convertStringToInteger } from '@/utils/helpers';
import { useTranslations } from 'next-intl';

interface OpenPositionsInputProps {
	value: ICoveredCallFiltersModalStates['openPositions'];
	onChange: (v: ICoveredCallFiltersModalStates['openPositions']) => void;
}

const OpenPositionsInput = ({ value, onChange }: OpenPositionsInputProps) => {
	const t = useTranslations('strategy_filters');

	return (
		<div className='flex h-40 w-full gap-8'>
			<InputLegend
				value={value[0]}
				onChange={(v) => onChange([v === '' ? null : Number(convertStringToInteger(v)), value[1]])}
				placeholder={t('from')}
				inputPlaceholder={t('first_value')}
				maxLength={16}
				className='h-full flex-1 bg-transparent px-8 text-center ltr'
				autoTranslateLegend
			/>

			<InputLegend
				value={value[1]}
				onChange={(v) => onChange([value[0], v === '' ? null : Number(convertStringToInteger(v))])}
				placeholder={t('to')}
				inputPlaceholder={t('seconds_value')}
				maxLength={16}
				className='h-full flex-1 bg-transparent px-8 text-center ltr'
				autoTranslateLegend
			/>
		</div>
	);
};

export default OpenPositionsInput;
