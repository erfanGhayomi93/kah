import { ArrowDownSVG } from '@/components/icons';
import { cn } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import Popup from '../Popup';
import styles from './Select.module.scss';

interface IClearableProps<T> {
	clearable: true;
	onChange: (option: T | null) => void;
}

interface INonClearableProps<T> {
	clearable?: false;
	onChange: (option: T) => void;
}

export type AsyncSelectProps<T> = (IClearableProps<T> | INonClearableProps<T>) & {
	value?: T | null;
	blankPlaceholder?: string;
	defaultPopupWidth?: number;
	placeholder?: string | React.ReactNode;
	defaultOpen?: boolean;
	disabled?: boolean;
	options: T[];
	minimumChars?: number;
	loading?: boolean;
	classes?: RecordClasses<
		| 'root'
		| 'focus'
		| 'border'
		| 'disabled'
		| 'box'
		| 'list'
		| 'value'
		| 'listItem'
		| 'alert'
		| 'input'
		| 'icon'
		| 'active'
	>;
	term: string;
	onChangeTerm: (term: string) => void;
	getOptionId: (option: T) => string | number;
	getOptionTitle: (option: T | null) => React.ReactNode;
};

const AsyncSelect = <T,>({
	value,
	options,
	classes,
	defaultPopupWidth,
	disabled,
	placeholder,
	blankPlaceholder,
	loading,
	defaultOpen,
	term,
	minimumChars = 0,
	getOptionId,
	getOptionTitle,
	onChangeTerm,
	onChange,
}: AsyncSelectProps<T>) => {
	const t = useTranslations();

	const [mode, setMode] = useState<'focusing' | 'typing' | null>(null);

	const onClickItem = (option: T, callback: () => void) => {
		onChange(option);
		callback();
	};

	const onClose = () => {
		setMode(null);
		onChangeTerm('');
	};

	const onOpen = () => {
		setMode('focusing');
		onChangeTerm('');
	};

	return (
		<Popup
			zIndex={9999}
			defaultPopupWidth={defaultPopupWidth}
			defaultOpen={defaultOpen}
			disabled={disabled}
			onOpen={onOpen}
			onClose={onClose}
			renderer={({ setOpen }) => {
				if ((minimumChars && term.length < minimumChars) || loading)
					return (
						<div className={cn(styles.alert, classes?.alert)}>
							{loading ? t('common.searching') : t('common.needs_more_than_n_chars', { n: minimumChars })}
						</div>
					);

				if (!Array.isArray(options) || options.length === 0)
					return (
						<div className={cn(styles.alert, classes?.alert)}>
							<span>{blankPlaceholder ?? t('common.no_data')}</span>
						</div>
					);

				return (
					<div className={cn(styles.box, classes?.box)}>
						<ul className={cn(styles.list, classes?.list)}>
							{options.map((option) => (
								<li
									onClick={() => onClickItem(option, () => setOpen(false))}
									key={getOptionId(option)}
									className={cn(
										styles.listItem,
										classes?.listItem,
										value &&
											getOptionId(option) === getOptionId(value) && [
												styles.active,
												classes?.active,
											],
									)}
								>
									{getOptionTitle(option)}
								</li>
							))}
						</ul>
					</div>
				);
			}}
		>
			{({ setOpen, open }) => (
				<label
					className={cn(
						'input-group',
						styles.root,
						classes?.root,
						!placeholder && [styles.border, classes?.border],
						disabled && ['disabled', styles.disabled, classes?.disabled],
						mode && [styles.focus, classes?.focus],
					)}
				>
					<input
						type='text'
						className={cn(styles.input, classes?.input)}
						value={term}
						disabled={disabled}
						onFocus={() => setOpen(true)}
						onChange={(e) => {
							onChangeTerm(e.target.value);
							setMode('typing');
						}}
					/>

					{placeholder && (
						<>
							<span
								className={cn(
									'flexible-placeholder',
									(value || term.length || mode) && ['active', mode && 'colorful'],
								)}
							>
								{placeholder}
							</span>

							<fieldset className={cn('flexible-fieldset', (mode || value) && 'active')}>
								<legend>{placeholder}</legend>
							</fieldset>
						</>
					)}

					{mode !== 'typing' && value && (
						<span
							className={cn(
								styles.value,
								classes?.value,
								mode === 'focusing' && [styles.focus, classes?.focus],
							)}
						>
							{getOptionTitle(value)}
						</span>
					)}

					{loading ? (
						<div className='min-h-20 min-w-20 spinner' />
					) : (
						<button
							type='button'
							style={{ transform: open ? 'rotate(180deg)' : undefined }}
							className={cn(styles.icon, classes?.icon)}
							onClick={() => setOpen(!open)}
						>
							<ArrowDownSVG width='1.6rem' height='1.6rem' />
						</button>
					)}
				</label>
			)}
		</Popup>
	);
};

export default AsyncSelect;
