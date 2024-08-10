import { ArrowRightSVG, CalendarSVG, DoubleArrowLeftSVG, DoubleArrowRightSVG, XSVG } from '@/components/icons';
import { getDateMilliseconds, weekDaysName, yearMonthsName } from '@/constants';
import dayjs from '@/libs/dayjs';
import { cn, dayAsJalali, isBefore, isBetween, isSameOrAfter, isSameOrBefore } from '@/utils/helpers';
import clsx from 'clsx';
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useTranslations } from 'next-intl';
import styles from './AdvanceDatePicker.module.scss';

type DateValue = null | string | number | Date;

interface DayType {
	enable: boolean;
	weekInMonth: number | null;
	year: string | number;
	month: string | number | null;
	id: number;
	holiday: boolean;
	date: string | number | null;
}

interface AdvancedDatepickerProps {
	clearable?: boolean;
	disabledIsBefore?: number;
	disabledIsSameOrBefore?: number;
	disabledIsAfter?: number;
	disabledIsSameOrAfter?: number;
	value: DateValue;
	placeholder?: string;
	weekDays?: string[];
	placement?: 'top' | 'bottom';
	classes?: Partial<
		Record<
			| 'datepicker'
			| 'opened'
			| 'dark'
			| 'active'
			| 'container'
			| 'labels'
			| 'input'
			| 'icon'
			| 'dialogBox'
			| 'switch'
			| 'border'
			| 'switchIcon'
			| 'weekDays'
			| 'days'
			| 'day'
			| 'arrows'
			| 'date'
			| 'monthsRoot'
			| 'months'
			| 'month',
			ClassesValue | undefined
		>
	>;
	dateIsDisabled?: (date: Date) => boolean;
	onChange: (date: Date) => void;
	fixedPlaceholder?: string;
	nonBorder?: boolean;
	dataTestId?: string;
}

const AdvancedDatepicker = ({
	classes,
	value,
	clearable,
	placement = 'bottom',
	placeholder,
	dateIsDisabled,
	disabledIsBefore,
	disabledIsSameOrBefore,
	disabledIsAfter,
	disabledIsSameOrAfter,
	onChange,
	fixedPlaceholder,
	nonBorder = false,
	weekDays = weekDaysName,
	dataTestId = 'advanced_date_picker',
}: AdvancedDatepickerProps) => {
	const rootRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const datepickerRef = useRef<HTMLDivElement | undefined>(undefined);

	const [focusing, setFocusing] = useState(false);

	const [visibleCalendar, setVisibleCalendar] = useState(false);

	const valueAsJalali = useMemo(() => {
		const d = value ? new Date(value) : new Date();
		return dayjs(d).calendar('jalali').format('YYYY / MM / DD');
	}, [value]);

	const [inputValue, setInputValue] = useState(valueAsJalali);

	const onClickDocument = (e: MouseEvent) => {
		const rootEl = rootRef.current;
		const datepickerEl = datepickerRef.current;
		if (!rootEl || !datepickerEl) {
			setVisibleCalendar(false);
			document.removeEventListener('mousedown', onClickDocument);
			return;
		}

		const target: Node = (e.target || e.currentTarget) as Node;
		if (target && !datepickerEl.contains(target) && !rootEl.contains(target)) {
			setVisibleCalendar(false);
			document.removeEventListener('mousedown', onClickDocument);
		}
	};

	const onClickIcon = () => {
		const inputElement = inputRef.current;
		if (!inputElement) return;

		setInputValue('');
		inputElement.focus();

		openCalendar();
	};

	const isValidYear = (value: Date) => {
		const d = dayAsJalali(value).calendar('jalali');
		if (!d.isValid()) return;

		const nYear = value.getFullYear();
		const currentYear = new Date().getFullYear();

		return isBetween(currentYear - 100, nYear, currentYear + 100);
	};

	const isDisabledDate = (d: Date): boolean => {
		if (dateIsDisabled) return dateIsDisabled(d);
		if (typeof disabledIsBefore === 'number') return isBefore(d, new Date(disabledIsBefore));
		if (typeof disabledIsSameOrBefore === 'number') return isSameOrBefore(d, new Date(disabledIsSameOrBefore));
		if (typeof disabledIsAfter === 'number') return d.getTime() > disabledIsAfter;
		if (typeof disabledIsSameOrAfter === 'number') return isSameOrAfter(d, new Date(disabledIsSameOrAfter));

		return false;
	};

	const onBlurInput = (value: string, blurInput = true) => {
		if (blurInput) setFocusing(false);

		value = value.replace(/\s/g, '');

		const d = dayAsJalali(value).calendar('jalali');
		if (!d.isValid()) return;

		const asDate = d.toDate();

		if (isValidYear(asDate) === false) return;

		if (!isDisabledDate(asDate)) onChange(asDate);
	};

	const openCalendar = () => {
		setVisibleCalendar(true);
		setFocusing(true);
		document.addEventListener('mousedown', onClickDocument);
	};

	const onKeydown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		try {
			const { key } = e;

			if (['Enter', 'ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(key)) {
				e.preventDefault();
				e.stopPropagation();
			}

			if (key === 'Enter') {
				onBlurInput(inputValue, true);
				return setVisibleCalendar(false);
			}

			if (key === 'Tab') return setVisibleCalendar(false);

			if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'ArrowRight' || key === 'ArrowLeft') {
				const { Week: weekAsTimestamp, Day: dayAsTimestamp } = getDateMilliseconds;
				const timestamps = {
					ArrowDown: weekAsTimestamp,
					ArrowUp: -1 * weekAsTimestamp,
					ArrowRight: -1 * dayAsTimestamp,
					ArrowLeft: dayAsTimestamp,
				};

				if (value === null) return;

				const valueAsTimestamp = typeof value === 'number' ? value : new Date(value).getTime();
				const nextDate = new Date(valueAsTimestamp + timestamps[key]);

				if (isDisabledDate(nextDate) || isValidYear(nextDate) === false) return;

				onChange(nextDate);
			}
		} catch (e) {
			//
		}
	};

	const checkDateValue = (str: string, max: number) => {
		if (str.charAt(0) !== '0' || str === '00') {
			let num = Number(str);
			if (isNaN(num) || num <= 0 || num > max) num = 1;

			str = num > Number(max.toString().charAt(0)) && num.toString().length === 1 ? `0${num}` : num.toString();
		}

		return str;
	};

	const dateFormatter = (input: string) => {
		try {
			if (/\D\/$/.test(input)) input = input.substr(0, input.length - 3);

			const values = input.split('/').map((v) => {
				return v.replace(/\D/g, '');
			});

			if (values[1]) values[1] = checkDateValue(values[1], 12);
			if (values[2]) values[2] = checkDateValue(values[2], 31);

			const output = values.map((v, i) => {
				return (v.length === 4 && i === 0) || (v.length === 2 && i === 1) ? `${v} / ` : v;
			});

			return output.join('').substring(0, 14);
		} catch (e) {
			return '';
		}
	};

	const onDatepickerLoad = useCallback(
		(datepickerEl: HTMLDivElement) => {
			const rootEl = rootRef.current;
			if (!rootEl || !datepickerEl) return;

			datepickerRef.current = datepickerEl;

			const rectOffset = rootEl.getBoundingClientRect();
			const datepickerOffset = datepickerEl.getBoundingClientRect();

			datepickerEl.style.width = rectOffset.width + 'px';
			datepickerEl.style.left = rectOffset.left + 'px';
			if (placement === 'bottom') {
				datepickerEl.style.top = rectOffset.top + rectOffset.height + 1 + 'px';
			} else {
				datepickerEl.style.top = rectOffset.top - datepickerOffset.height - 1 + 'px';
			}
		},
		[rootRef.current],
	);

	useEffect(() => {
		setInputValue(valueAsJalali);
	}, [valueAsJalali]);

	useEffect(() => {
		if (!focusing) {
			setInputValue(valueAsJalali);

			const eInput = inputRef.current;
			if (eInput) eInput.blur();
		}
	}, [focusing]);

	return (
		<div
			data-testid={dataTestId}
			ref={rootRef}
			className={clsx(
				styles.datepicker,
				classes?.datepicker,
				!fixedPlaceholder && [styles.border, classes?.border],
				visibleCalendar && [styles.opened, classes?.opened],
				// theme === 'dark' && [styles.dark, classes?.dark],
				nonBorder && styles.nonBorder,
			)}
		>
			<div className={clsx(styles.container, classes?.container, 'relative input-group')}>
				{Boolean(fixedPlaceholder) && (
					<>
						<span className={cn(' flexible-placeholder active')}>{fixedPlaceholder}</span>

						<fieldset className={cn('flexible-fieldset  active')}>
							<legend>{fixedPlaceholder}</legend>
						</fieldset>
					</>
				)}

				<input
					type='text'
					ref={inputRef}
					className={clsx(styles.input, visibleCalendar && [styles.active, classes?.active], classes?.input)}
					placeholder={placeholder || 'ــ / ــ / ــــ'}
					value={focusing ? inputValue : valueAsJalali}
					onKeyDown={onKeydown}
					onChange={(e) => setInputValue(dateFormatter(e.target.value))}
					onFocus={(e) => {
						e.stopPropagation();
						openCalendar();
					}}
					onBlur={(e) => onBlurInput(e.target.value)}
					onClick={() => {
						if (focusing && !visibleCalendar) setVisibleCalendar(true);
					}}
					data-testid={`${dataTestId}_input`}
				/>

				<span tabIndex={-1} role='button' onClick={onClickIcon} className={clsx(styles.icon, classes?.icon)}>
					{!inputValue ? (
						<CalendarSVG width='1.6rem' height='1.6rem' />
					) : (
						clearable && <XSVG width='1.6rem' height='1.6rem' />
					)}
				</span>
			</div>

			{visibleCalendar &&
				createPortal(
					<DialogBox
						ref={onDatepickerLoad}
						value={value}
						isDisabledDate={isDisabledDate}
						weekDays={weekDays}
						onChange={onChange}
						onClose={() => setVisibleCalendar(false)}
						dataTestId={`${dataTestId}_dialogbox`}
					/>,
					document.body,
				)}
		</div>
	);
};

interface DialogBoxProps {
	value: null | string | number | Date;
	weekDays: string[];
	onClose: () => void;
	isDisabledDate: (date: Date) => boolean;
	classes?: Partial<
		Record<
			| 'datepicker'
			| 'opened'
			| 'today'
			| 'dark'
			| 'active'
			| 'container'
			| 'labels'
			| 'input'
			| 'icon'
			| 'dialogBox'
			| 'switch'
			| 'switchIcon'
			| 'weekDays'
			| 'days'
			| 'day'
			| 'arrows'
			| 'date'
			| 'monthsRoot'
			| 'months'
			| 'month',
			ClassesValue | undefined
		>
	>;
	onChange: ((date: Date | null) => void) | ((date: Date) => void);
	dataTestId?: string;
}

const DialogBox = forwardRef<HTMLDivElement, DialogBoxProps>(
	({ classes, isDisabledDate, weekDays, value, onChange, onClose, dataTestId }, ref) => {
		const t = useTranslations();

		const [datepickerValue, setDatepickerValue] = useState<DateValue>(value);

		const [mode, setMode] = useState<'month' | 'year' | null>(null);

		// const { theme } = useTheme();

		const onEditDate = (method: 'add' | 'subtract', name: 'year' | 'month') => {
			if (!datepickerValue) return;

			const d = dayjs(datepickerValue).calendar('jalali')[method](1, name).toDate();
			setDatepickerValue(d);
		};

		const onClickDay = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, day: DayType): void => {
			e.stopPropagation();
			if (!day.enable) return;

			if (isDisabledDate(dayAsJalali(`${day.year}/${day.month}/${day.date}`).toDate())) return;

			const d = dayAsJalali(`${day.year}/${day.month}/${day.date}`).toDate();

			onChange(d);
			onClose();
		};

		const onChangeMonth = (monthKey: number) => {
			if (!datepickerValue) return;

			const value = dayjs(datepickerValue).calendar('jalali').set('month', monthKey).toDate();

			setDatepickerValue(value);
			setMode(null);
		};

		const onChangeYear = (year: number) => {
			if (!datepickerValue) return;

			const value = dayjs(datepickerValue).calendar('jalali').set('year', year).toDate();

			setDatepickerValue(value);
			setMode(null);
		};

		const setTodayDate = () => {
			const d = new Date();

			if (isDisabledDate(d)) return;

			onChange(d);
			setDatepickerValue(d);
		};

		const getDatepickerValue = useMemo(() => {
			if (!datepickerValue) return [];

			const d = dayjs(datepickerValue).locale('fa').calendar('jalali').format('YYYY MMMM DD');

			return d.split(' ');
		}, [datepickerValue]);

		const daysInMonth = useMemo(() => {
			if (!datepickerValue) return;
			/* 
			0: [0, 1, 2, 3, 4, 5, 6],
			1: [7, 8, 9, 10, 11, 12, 13],
			2: [14, 15, 16, 17, 18, 19, 20],
			3: [21, 22, 23, 24, 25, 26, 27],
			4: [28, 29, 30, 29 | 30 | 31]
			*/

			type WeekType = DayType[];
			const weeks: [WeekType, WeekType, WeekType, WeekType, WeekType, WeekType] = [
				Array(7),
				Array(7),
				Array(7),
				Array(7),
				Array(7),
				Array(7),
			];
			const d = dayjs(datepickerValue).locale('fa').calendar('jalali').date(1);
			const firstDayOfMonthWeekday = d.weekday();

			const daysInMonth = d.daysInMonth();

			const currentDate = d.format('YYYY/MM').split('/');
			for (let i = 0; i < daysInMonth + firstDayOfMonthWeekday; i++) {
				const weekNumber = Math.floor(i / 7);
				const weekday = i % 7;
				const isEnable = i >= firstDayOfMonthWeekday;
				const day = {
					enable: isEnable,
					weekInMonth: isEnable ? weekNumber : null,
					year: currentDate[0],
					month: isEnable ? currentDate[1] : null,
					holiday: !((i + 1) % 7),
					id: i,
					date: isEnable ? i - firstDayOfMonthWeekday + 1 : null,
				};

				weeks[weekNumber][weekday] = day;
			}

			return weeks;
		}, [datepickerValue]);

		const dateIsEqual = useCallback(
			(date: string) => {
				return dayjs(value).calendar('jalali').format('YYYY/MM/D') === date;
			},
			[value],
		);

		useEffect(() => {
			setDatepickerValue(value);
		}, [value]);

		return (
			<div
				ref={ref}
				onClick={(e) => e.stopPropagation()}
				tabIndex={-1}
				role='button'
				className={clsx(styles.dialogBox, classes?.dialogBox, 'bg-white darkness:bg-gray-50')}
				data-testid={dataTestId}
			>
				<div className={clsx(styles.switch, classes?.switch)}>
					<div className={clsx(styles.arrows, classes?.arrows)}>
						<button
							role='button'
							onClick={() => onEditDate('subtract', 'year')}
							type='button'
							data-testid={`${dataTestId}_prev_year`}
						>
							<DoubleArrowRightSVG width='1.6rem' height='1.6rem' />
						</button>

						<button
							role='button'
							onClick={() => onEditDate('subtract', 'month')}
							type='button'
							data-testid={`${dataTestId}_prev_month`}
						>
							<ArrowRightSVG width='1.6rem' height='1.6rem' />
						</button>
					</div>

					<div className={clsx(styles.date, classes?.date)}>
						<button
							role='button'
							onClick={() => setMode('month')}
							type='button'
							data-testid={`${dataTestId}_set_month`}
						>
							{getDatepickerValue?.[1]}
						</button>
						<button
							role='button'
							onClick={() => setMode('year')}
							type='button'
							data-testid={`${dataTestId}_set_year`}
						>
							{getDatepickerValue?.[0]}
						</button>
					</div>

					<div className={clsx(styles.arrows, classes?.arrows)}>
						<button
							role='button'
							onClick={() => onEditDate('add', 'month')}
							type='button'
							data-testid={`${dataTestId}_next_month`}
							className='rotate-180'
						>
							<ArrowRightSVG width='1.6rem' height='1.6rem' />
						</button>

						<button
							role='button'
							onClick={() => onEditDate('add', 'year')}
							type='button'
							data-testid={`${dataTestId}_next_year`}
						>
							<DoubleArrowLeftSVG width='1.6rem' height='1.6rem' />
						</button>
					</div>
				</div>

				<ul data-testid={`${dataTestId}_weekDays`} className={clsx(styles.weekDays, classes?.weekDays)}>
					{weekDays.map((day) => (
						<li data-testid={`${dataTestId}_weekDays_${day}`} key={day}>
							{day}
						</li>
					))}
				</ul>

				<ul data-testid={`${dataTestId}_daysInMonth`} className={clsx(styles.days, classes?.days)}>
					{daysInMonth?.map((week, key) => (
						<li key={key}>
							<ul>
								{week.map((day) => (
									<li key={day.id}>
										<button
											role='button'
											type='button'
											onClick={(e) => onClickDay(e, day)}
											className={clsx(styles.day, classes?.day, {
												[styles.holiday]: day.holiday,
												[styles.disabled]: isDisabledDate(
													dayAsJalali(`${day.year}/${day.month}/${day.date}`).toDate(),
												),
												[styles.active]: dateIsEqual(`${day.year}/${day.month}/${day.date}`),
											})}
											data-testid={`${dataTestId}_daysInMonth_${day.date ?? ''}`}
										>
											{day.date ?? ''}
										</button>
									</li>
								))}
							</ul>
						</li>
					))}
				</ul>

				<div className={clsx(styles.today, classes?.today)}>
					<button data-testid={`${dataTestId}_today_date`} role='button' type='button' onClick={setTodayDate}>
						{t('dates.today')}
					</button>
				</div>

				{mode === 'month' && (
					<Months
						value={getDatepickerValue[1] ?? ''}
						onChange={onChangeMonth}
						onClose={() => setMode(null)}
						classes={{
							active: classes?.active,
						}}
						dataTestId={`${dataTestId}_months`}
					/>
				)}

				{mode === 'year' && (
					<Years
						value={Number(getDatepickerValue[0] ?? 0)}
						onChange={onChangeYear}
						onClose={() => setMode(null)}
						classes={{
							active: classes?.active,
						}}
						dataTestId={`${dataTestId}_years`}
					/>
				)}
			</div>
		);
	},
);

interface MonthsProps {
	value: string;
	months?: string[];
	onChange: (arg: number) => void;
	onClose: () => void;
	classes?: Partial<Record<'list' | 'option' | 'selection' | 'active' | 'back', ClassesValue | undefined>>;
	dataTestId: string;
}
const Months = ({ onChange, onClose, value, classes, months = yearMonthsName, dataTestId }: MonthsProps) => (
	<div className={clsx(styles.selection, classes?.selection, 'bg-white darkness:bg-gray-50')}>
		<div className={clsx(styles.back, classes?.back)}>
			<button role='button' type='button' onClick={onClose} data-testid={`${dataTestId}_close`}>
				<XSVG width='2rem' height='2rem' />
			</button>
		</div>

		<ul className={clsx(styles.list, classes?.list)}>
			{months.map((month, key) => (
				<li key={month}>
					<button
						role='button'
						onClick={() => onChange(key)}
						type='button'
						className={clsx(
							styles.option,
							classes?.option,
							value === month && [styles.active, classes?.active],
						)}
						data-testid={`${dataTestId}_${month}`}
					>
						{month}
					</button>
				</li>
			))}
		</ul>
	</div>
);

interface YearsProps {
	value: number;
	onChange: (arg: number) => void;
	onClose: () => void;
	classes?: Partial<Record<'list' | 'option' | 'selection' | 'active' | 'back', ClassesValue | undefined>>;
	dataTestId: string;
}
const Years = ({ onChange, onClose, value, classes, dataTestId }: YearsProps) => {
	const availableYears = useMemo(() => {
		const yearAsNumber = Number(value);

		const years: number[] = [];
		for (let i = yearAsNumber - 15; i < yearAsNumber + 15; i++) {
			years.push(i);
		}

		return years;
	}, [value]);

	return (
		<div className={clsx(styles.selection, classes?.selection)}>
			<div className={clsx(styles.back, classes?.back)}>
				<button role='button' type='button' onClick={onClose} data-testid={`${dataTestId}_close`}>
					<XSVG width='2rem' height='2rem' />
				</button>
			</div>

			<ul className={clsx(styles.list, classes?.list)}>
				{availableYears.map((year) => (
					<li key={year}>
						<button
							role='button'
							type='button'
							onClick={() => onChange(year)}
							className={clsx(
								styles.option,
								classes?.option,
								value === year && [styles.active, classes?.active],
							)}
							data-testid={`${dataTestId}_${year}`}
						>
							{year}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default AdvancedDatepicker;
