import { convertStringToInteger, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface ContractSizeInputProps {
	value: IOptionWatchlistFilters['contractSize'];
	onChange: (value: IOptionWatchlistFilters['contractSize']) => void;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	borderClass?: ClassesValue;
}

const Input = ({ borderClass, ...props }: InputProps) => (
	<input
		type='text'
		inputMode='decimal'
		maxLength={12}
		className={clsx(
			'h-40 w-full rounded border px-8 text-left text-gray-100 ltr',
			borderClass || 'border-gray-400',
		)}
		{...props}
	/>
);

const ContractSizeInput = ({ value: [fromValue, toValue], onChange }: ContractSizeInputProps) => {
	const t = useTranslations();

	const valueFormatter = (value: number): string => {
		if (value <= 0) return '';
		return sepNumbers(String(value));
	};

	return (
		<div className='flex-1 gap-16 flex-justify-end'>
			<div className='flex-1 gap-8 flex-items-center'>
				<span>{t('common.from')}</span>
				<Input
					value={valueFormatter(fromValue) || ''}
					onChange={(e) => onChange([Number(convertStringToInteger(e.target.value)), toValue])}
				/>
			</div>
			<div className='flex-1 gap-8 flex-items-center'>
				<span>{t('common.to')}</span>
				<Input
					value={valueFormatter(toValue) || ''}
					onChange={(e) => onChange([fromValue, Number(convertStringToInteger(e.target.value))])}
					borderClass={
						toValue !== 0 &&
						Boolean(fromValue) &&
						Boolean(toValue) &&
						Number(fromValue) > Number(toValue) &&
						'border-error-100'
					}
				/>
			</div>
		</div>
	);
};

export default ContractSizeInput;
