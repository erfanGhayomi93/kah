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
	hasError?: boolean;
	classes?: RecordClasses<'prefix'>;
}

const InputLegend = ({
	value,
	valueSeparator = true,
	placeholder,
	prefix,
	separator = true,
	autoTranslateLegend = false,
	hasError = false,
	inputPlaceholder,
	height = '48',
	legendWidth,
	disabled,
	classes,
	onChange,
	...props
}: InputLegendProps) => {
	const isActive = autoTranslateLegend || (value && String(value).length > 0);

	return (
		<label
			className={clsx(
				`relative h-${height} w-full rounded flex-items-center input-group`,
				!placeholder && 'border border-light-gray-200',
				disabled && 'bg-light-gray-100',
			)}
		>
			<input
				placeholder={inputPlaceholder}
				type='text'
				inputMode='numeric'
				className={clsx(
					'h-full flex-1 bg-transparent px-8 text-left ltr',
					hasError ? 'text-light-error-100' : 'text-light-gray-800',
				)}
				value={value === null ? '' : valueSeparator ? sepNumbers(String(value)) : value}
				disabled={disabled}
				onChange={(e) => {
					if (!disabled) onChange?.(e.target.value);
				}}
				{...props}
			/>

			{placeholder && (
				<>
					<div
						className={cn(
							'gap-8 flex-items-center flexible-placeholder',
							hasError && '!text-light-error-100',
							isActive && 'active',
						)}
					>
						{placeholder}
					</div>

					<fieldset
						className={cn('flexible-fieldset', hasError && '!border-light-error-100', isActive && 'active')}
					>
						<legend style={{ width: legendWidth ? `${legendWidth / 10}rem` : undefined }}>
							{placeholder}
						</legend>
					</fieldset>
				</>
			)}

			{prefix && (
				<span
					className={clsx(
						'h-24 px-8 text-tiny text-light-gray-500 flex-justify-center',
						classes?.prefix,
						separator && 'border-r-input border-r',
					)}
				>
					{prefix}
				</span>
			)}
		</label>
	);
};

export default InputLegend;
