import { cn, sepNumbers } from '@/utils/helpers';
import clsx from 'clsx';

interface InputLegendProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'prefix' | 'placeholder' | 'onChange'> {
	onChange?: (v: string) => void;
	value: string | number | null;
	prefix?: React.ReactNode;
	placeholder: React.ReactNode;
	separator?: boolean;
	height?: string;
	valueSeparator?: boolean;
	inputPlaceholder?: string;
	autoTranslateLegend?: boolean;
	legendWidth?: number;
}

const InputLegend = ({
	value,
	valueSeparator = true,
	placeholder,
	prefix,
	separator = true,
	autoTranslateLegend = false,
	inputPlaceholder,
	height = '48',
	legendWidth,
	onChange,
	disabled,
	...props
}: InputLegendProps) => {
	const isActive = autoTranslateLegend || (value && String(value).length > 0);

	return (
		<label
			className={clsx(
				`relative h-${height} w-full rounded flex-items-center input-group`,
				!placeholder && 'border border-gray-500',
				disabled && 'bg-gray-200',
			)}
		>
			<input
				placeholder={inputPlaceholder}
				type='text'
				inputMode='numeric'
				className='h-full flex-1 bg-transparent px-8 text-left ltr'
				value={value === null ? '' : valueSeparator ? sepNumbers(String(value)) : value}
				disabled={disabled}
				onChange={(e) => {
					if (!disabled) onChange?.(e.target.value);
				}}
				{...props}
			/>

			{placeholder && (
				<>
					<div className={cn('gap-8 flex-items-center flexible-placeholder', isActive && 'active')}>
						{placeholder}
					</div>

					<fieldset className={cn('flexible-fieldset', isActive && 'active')}>
						<legend style={{ width: legendWidth ? `${legendWidth / 10}rem` : undefined }}>
							{placeholder}
						</legend>
					</fieldset>
				</>
			)}

			{prefix && (
				<span
					className={clsx(
						'h-24 px-8 text-tiny text-gray-700 flex-justify-center',
						separator && 'border-r border-r-input',
					)}
				>
					{prefix}
				</span>
			)}
		</label>
	);
};

export default InputLegend;
