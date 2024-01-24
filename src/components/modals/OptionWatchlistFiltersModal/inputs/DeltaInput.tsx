import clsx from 'clsx';
import { useTranslations } from 'next-intl';

interface DeltaInputProps {
	value: IOptionWatchlistFilters['delta'];
	onChange: (value: IOptionWatchlistFilters['delta']) => void;
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

const DeltaInput = ({ value: [fromValue, toValue], onChange }: DeltaInputProps) => {
	const t = useTranslations();

	const valueFormatter = (value: string) => {
		return value.replace(/[^0-9.-]/gi, '') || '';
	};

	const onBlurInput = (value: string, cb: (value: string) => void) => {
		const valueAsNumber = Number(value);

		if (!valueAsNumber || isNaN(valueAsNumber)) cb('');
		if (valueAsNumber < -1) cb('-1');
		if (valueAsNumber > 1) cb('1');
	};

	return (
		<div className='flex-1 gap-16 flex-justify-end'>
			<div className='flex-1 gap-8 flex-items-center'>
				<span>{t('common.from')}</span>
				<Input
					value={valueFormatter(fromValue)}
					onChange={(e) => onChange([e.target.value, toValue])}
					onBlur={(e) => onBlurInput(e.target.value, (v) => onChange([v, toValue]))}
					maxLength={9}
				/>
			</div>
			<div className='flex-1 gap-8 flex-items-center'>
				<span>{t('common.to')}</span>
				<Input
					value={valueFormatter(toValue)}
					onChange={(e) => onChange([fromValue, e.target.value])}
					onBlur={(e) => onBlurInput(e.target.value, (v) => onChange([fromValue, v]))}
					maxLength={9}
					borderClass={
						toValue &&
						toValue !== '0' &&
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

export default DeltaInput;
