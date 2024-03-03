import { cn } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { ArrowDownSVG } from '../../icons';
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
	label: string | React.ReactNode;
	defaultOpen?: boolean;
	options: T[];
	loading?: boolean;
	classes?: RecordClasses<'root' | 'focus' | 'list' | 'listItem' | 'alert' | 'input' | 'icon' | 'active'>;
	term: string;
	onChangeTerm: (term: string) => void;
	getOptionId: (option: T) => string | number;
	getOptionTitle: (option: T | null) => string;
};

const AsyncSelect = <T,>({
	value,
	options,
	classes,
	label,
	clearable,
	loading,
	defaultOpen,
	term,
	getOptionId,
	getOptionTitle,
	onChangeTerm,
	onChange,
}: AsyncSelectProps<T>) => {
	const t = useTranslations();

	const [focusing, setFocusing] = useState(false);

	const onClickItem = (option: T, callback: () => void) => {
		onChangeTerm(getOptionTitle(option));
		onChange(option);
		callback();
	};

	const onClose = () => {
		setFocusing(false);
		if (!value) onChangeTerm('');
	};

	const onClear = () => {
		if (clearable) onChange(null);
	};

	return (
		<Popup
			zIndex={9999}
			defaultOpen={defaultOpen}
			renderer={({ setOpen }) => {
				if (term.length <= 1 || loading)
					return (
						<div className={cn(styles.alert, classes?.alert)}>
							{loading ? t('common.searching') : t('common.needs_more_than_n_chars', { n: 2 })}
						</div>
					);

				if (!Array.isArray(options) || options.length === 0)
					return (
						<div className={cn(styles.alert, classes?.alert)}>
							<span>{t('common.no_symbol_found')}</span>
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
			onOpen={() => setFocusing(true)}
			onClose={onClose}
		>
			{({ setOpen, open }) => (
				<label className={cn(styles.root, classes?.root, focusing && [styles.focus, classes?.focus])}>
					<input
						type='text'
						className={cn(styles.input, classes?.input)}
						value={focusing ? term : value ? getOptionTitle(value) : term}
						onFocus={() => setOpen(true)}
						onChange={(e) => onChangeTerm(e.target.value)}
					/>

					<span
						className={cn(
							'flexible-placeholder',
							(value || term.length || focusing) && ['active', focusing && 'colorful'],
						)}
					>
						{label}
					</span>

					{loading ? (
						<div className='ml-16 min-h-20 min-w-20 spinner' />
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
