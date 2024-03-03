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

type AsyncSelectProps<T> = (IClearableProps<T> | INonClearableProps<T>) & {
	value?: T | null;
	blankPlaceholder?: string;
	placeholder: string | React.ReactNode;
	defaultOpen?: boolean;
	options: T[];
	minimumChars?: number;
	loading?: boolean;
	classes?: RecordClasses<'root' | 'focus' | 'list' | 'value' | 'listItem' | 'alert' | 'input' | 'icon' | 'active'>;
	term: string;
	onChangeTerm: (term: string) => void;
	getOptionId: (option: T) => string | number;
	getInputValue: (option: T) => string;
	getOptionTitle: (option: T | null) => React.ReactNode;
};

const AsyncSelect = <T,>({
	value,
	options,
	classes,
	placeholder,
	blankPlaceholder,
	clearable,
	loading,
	defaultOpen,
	term,
	minimumChars = 0,
	getOptionId,
	getInputValue,
	getOptionTitle,
	onChangeTerm,
	onChange,
}: AsyncSelectProps<T>) => {
	const t = useTranslations();

	const [focusing, setFocusing] = useState(false);

	const onClickItem = (option: T, callback: () => void) => {
		onChange(option);
		callback();
	};

	const onClose = () => {
		setFocusing(false);
		onChangeTerm('');
	};

	const onOpen = () => {
		setFocusing(true);
		if (value) onChangeTerm(getInputValue(value));
	};

	const onClear = () => {
		if (clearable) onChange(null);
	};

	return (
		<Popup
			zIndex={9999}
			defaultOpen={defaultOpen}
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
					<ul className={cn(styles.list, classes?.list)}>
						{options.map((option) => (
							<li
								onClick={() => onClickItem(option, () => setOpen(false))}
								key={getOptionId(option)}
								className={cn(
									styles.listItem,
									classes?.listItem,
									value &&
										getOptionId(option) === getOptionId(value) && [styles.active, classes?.active],
								)}
							>
								{getOptionTitle(option)}
							</li>
						))}
					</ul>
				);
			}}
			onOpen={onOpen}
			onClose={onClose}
		>
			{({ setOpen, open }) => (
				<label className={cn(styles.root, classes?.root, focusing && [styles.focus, classes?.focus])}>
					<input
						type='text'
						className={cn(styles.input, classes?.input)}
						value={term}
						onFocus={() => setOpen(true)}
						onChange={(e) => onChangeTerm(e.target.value)}
					/>

					<span
						className={cn(
							'flexible-placeholder',
							(value || term.length || focusing) && ['active', focusing && 'colorful'],
						)}
					>
						{placeholder}
					</span>

					{!focusing && value && (
						<span className={cn(styles.value, classes?.value)}>{getOptionTitle(value)}</span>
					)}

					{loading ? (
						<div className='min-h-20 min-w-20 spinner' />
					) : (
						<ArrowDownSVG
							width='1.6rem'
							height='1.6rem'
							style={{ transform: open ? 'rotate(180deg)' : undefined }}
							className={cn(styles.icon, classes?.icon)}
						/>
					)}
				</label>
			)}
		</Popup>
	);
};

export default AsyncSelect;
