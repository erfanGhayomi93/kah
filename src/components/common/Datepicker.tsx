import { cn, getDateAsJalali } from '@/utils/helpers';
import { useState } from 'react';
import { CalendarSVG } from '../icons';
import styles from './Datepicker.module.scss';

type TValue = number | null;
type TInput = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>;

interface DatepickerProps extends TInput {
	clearable?: boolean;
	value: TValue;
	classes?: RecordClasses<'root' | 'clearable' | 'icon' | 'input'>;
	onChange: (value: TValue) => void;
}

const Datepicker = ({ classes, value, clearable, onChange, placeholder }: DatepickerProps) => {
	const [term, setTerm] = useState<string>(value ? getDateAsJalali(value) : '');

	const checkDateValue = (str: string, max: number) => {
		if (str.charAt(0) !== '0' || str === '00') {
			let num = Number(str);
			if (isNaN(num) || num <= 0 || num > max) num = 1;

			str = num > Number(max.toString().charAt(0)) && num.toString().length === 1 ? `0${num}` : num.toString();
		}

		return str;
	};

	const valueFormatter = (input: string) => {
		try {
			if (/\D\/$/.test(input)) input = input.substr(0, input.length - 3);

			const values = input.split('/').map((v) => {
				return v.replace(/\D/g, '');
			});

			if (values[1]) values[1] = checkDateValue(values[1], 12);
			if (values[2]) values[2] = checkDateValue(values[2], 31);

			const output = values.map((v, i) => {
				return (v.length === 4 && i === 0) || (v.length === 2 && i === 1) ? `${v}‌/‌` : v;
			});

			return output.join('').substring(0, 14);
		} catch (e) {
			return '';
		}
	};

	const isValidDate = (value: string) => {
		const formatIsValid = /[0-9]{4}\/[0-9]{2}\/[0-9]{2}/gi.test(term);
		if (!formatIsValid) return false;

		const d = value.split('/');
		const year = Number(d[0]);
		const month = Number(d[1]);
		const day = Number(d[2]);
		const isSecondHalf = month <= 12 && month >= 7;

		return year < 1500 && ((!isSecondHalf && day <= 31) || (isSecondHalf && day <= 30));
	};

	const onBlurInput = () => {
		if (isValidDate(term)) return;

		if (clearable) setTerm('');
		else setTerm(getDateAsJalali());
	};

	return (
		<div className={cn(styles.root, classes?.root, clearable && classes?.clearable)}>
			<input
				type='text'
				inputMode='numeric'
				placeholder={placeholder ?? 'xxxx/xx/xx'}
				className={cn(styles.input, classes?.input)}
				value={term}
				maxLength={14}
				onChange={(e) => setTerm(valueFormatter(e.target.value))}
				data-testid='datepicker'
				onBlur={onBlurInput}
			/>
			<span className={cn(styles.icon, classes?.icon)}>
				<CalendarSVG />
			</span>
		</div>
	);
};

export default Datepicker;
