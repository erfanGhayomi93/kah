import ErrorBoundary from '@/components/common/ErrorBoundary';
import InputLegend from '@/components/common/Inputs/InputLegend';
import BaseSymbolAdvanceSearch from '@/components/common/Symbol/BaseSymbolAdvanceSearch';
import Tooltip from '@/components/common/Tooltip';
import { InfoCircleSVG, PercentSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setStrategyFiltersModal } from '@/features/slices/modalSlice';
import { type NStrategyFilter } from '@/features/slices/types/modalSlice.interfaces';
import { useInputs } from '@/hooks';
import { convertStringToInteger } from '@/utils/helpers';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { forwardRef, useEffect, useState } from 'react';
import Modal, { Header } from '../Modal';

type TFilterValue = Record<
	string,
	string | number | Date | [number | null, number | null] | Array<string | null> | [Date | null, Date | null] | null
>;

type TInput = TFilterValue & {
	baseSymbols: Option.BaseSearch[];
};

interface ShareInputProps<T> {
	value: T;
	onChange: (v: T) => void;
}

interface RangeNumberProps extends ShareInputProps<[number | null, number | null]>, NStrategyFilter.IRangeNumber {}

interface SingleNumberProps extends ShareInputProps<number | null>, NStrategyFilter.ISingleNumber {}

interface ArrayStringProps extends ShareInputProps<Array<string | null>>, NStrategyFilter.IArrayString {}

interface SingleStringProps extends ShareInputProps<string | null>, NStrategyFilter.ISingleString {}

interface RangeDateProps extends ShareInputProps<[Date | null, Date | null]>, NStrategyFilter.IRangeDate {}

interface SingleDateProps extends ShareInputProps<Date | null>, NStrategyFilter.ISingleDate {}

interface FilterProps {
	title: string;
	titleHint?: string;
	children?: React.ReactNode;
	className?: string;
}

interface StrategyFiltersProps extends NStrategyFilter.IFilters {}

const StrategyFilters = forwardRef<HTMLDivElement, StrategyFiltersProps>(
	({ filters, suppressBaseSymbol = false, baseSymbols, onSubmit, ...props }, ref) => {
		const t = useTranslations('strategy_filters');

		const [loading, setLoading] = useState(true);

		const { inputs, setFieldValue, setInputs } = useInputs<TInput>({
			baseSymbols: [],
		});

		const dispatch = useAppDispatch();

		const onCloseModal = () => {
			dispatch(setStrategyFiltersModal(null));
		};

		const submit = (e: React.FormEvent) => {
			e.preventDefault();

			try {
				const changedFilters: TFilterValue = {};
				const keys = Object.keys(inputs);

				for (let i = 0; i < keys.length; i++) {
					const key = keys[i];
					const values = inputs[key];

					if (Array.isArray(values)) {
						if (values.length === 2) {
							if (values.filter((v) => v !== null).length !== 0) changedFilters[key] = [...values];
						} else if (values.length > 0) changedFilters[key] = [...values];
					} else if (values !== null) {
						changedFilters[key] = values;
					}
				}

				onSubmit(changedFilters);
			} catch (e) {
				//
			} finally {
				dispatch(setStrategyFiltersModal(null));
			}
		};

		const renderFilterChildren = (item: NStrategyFilter.TFilter) => {
			if (item.mode === 'array' && item.type === 'string') {
				return (
					<ArrayString
						{...item}
						value={inputs[item.id] as string[]}
						onChange={(v) => setFieldValue(item.id, v)}
					/>
				);
			}

			if (item.mode === 'single') {
				if (item.type === 'date') {
					return (
						<SingleDate
							{...item}
							value={inputs[item.id] as Date}
							onChange={(v) => setFieldValue(item.id, v)}
						/>
					);
				}

				if (item.type === 'string') {
					return (
						<SingleString
							{...item}
							value={inputs[item.id] as string}
							onChange={(v) => setFieldValue(item.id, v)}
						/>
					);
				}

				return (
					<SingleNumber
						{...item}
						value={inputs[item.id] as number}
						onChange={(v) => setFieldValue(item.id, v)}
					/>
				);
			}

			if (item.mode === 'range') {
				if (item.type === 'date') {
					return (
						<RangeDate
							{...item}
							value={inputs[item.id] as [Date, Date]}
							onChange={(v) => setFieldValue(item.id, v)}
						/>
					);
				}

				return (
					<RangeNumber
						{...item}
						value={inputs[item.id] as [number, number]}
						onChange={(v) => setFieldValue(item.id, v)}
					/>
				);
			}

			return null;
		};

		useEffect(() => {
			const values: TInput = {
				baseSymbols: [],
			};

			values.baseSymbols = baseSymbols ?? [];

			for (let i = 0; i < filters.length; i++) {
				const item = filters[i];
				values[item.id] = item.initialValue;
			}

			setInputs(values);
			setLoading(false);
		}, []);

		return (
			<Modal
				top='50%'
				style={{ modal: { transform: 'translate(-50%, -50%)' } }}
				onClose={onCloseModal}
				ref={ref}
				{...props}
			>
				<div style={{ width: '70rem' }} className='max-w-full flex-column'>
					<Header label={t('title')} onClose={onCloseModal} />

					<form onSubmit={submit} className='gap-24 bg-white p-24 flex-column'>
						<ul className='gap-32 flex-column'>
							{!loading && (
								<>
									<li>
										<BaseSymbolAdvanceSearch
											values={inputs.baseSymbols}
											onChange={(values) => setFieldValue('baseSymbols', values)}
										/>
									</li>

									{filters.map((item) => (
										<Filter
											key={item.id}
											title={item.title}
											titleHint={item.titleHint}
											className={item.mode === 'array' ? 'h-40' : 'h-48'}
										>
											<ErrorBoundary>{renderFilterChildren(item)}</ErrorBoundary>
										</Filter>
									))}
								</>
							)}
						</ul>

						<div className='flex-justify-end'>
							<button type='submit' className='w-1/2 rounded py-8 btn-primary'>
								{t('apply_filters')}
							</button>
						</div>
					</form>
				</div>
			</Modal>
		);
	},
);

const Filter = ({ title, titleHint, children, className }: FilterProps) => (
	<li className={clsx('flex-justify-between', className)}>
		<div className='gap-8 flex-justify-start'>
			<h3 className='text-gray-900'>{title}:</h3>
			{titleHint && (
				<Tooltip placement='top' content={titleHint}>
					<span className='cursor-pointer'>
						<InfoCircleSVG width='1.8rem' height='1.8rem' className='text-info' />
					</span>
				</Tooltip>
			)}
		</div>

		<div style={{ flex: '0 0 32.8rem' }} className='flex h-full gap-8'>
			{children}
		</div>
	</li>
);

const RangeNumber = ({ value, label, placeholder, type, onChange, initialValue, ...item }: RangeNumberProps) => {
	return (
		<>
			<InputLegend
				{...item}
				value={value[0] === null ? '' : value[0]}
				onChange={(v) => {
					const valueAsNumber = convertStringToInteger(v);
					onChange([valueAsNumber === '' ? null : Number(valueAsNumber), value[1]]);
				}}
				placeholder={label ? label[0] : undefined}
				inputPlaceholder={placeholder ? placeholder[0] : undefined}
				className='size-full bg-transparent px-8 text-center ltr placeholder:text-center'
				prefix={type === 'percent' ? <PercentPrefix /> : undefined}
				autoTranslateLegend
			/>

			<InputLegend
				{...item}
				value={value[1] === null ? '' : value[1]}
				onChange={(v) => {
					const valueAsNumber = convertStringToInteger(v);
					onChange([value[0], valueAsNumber === '' ? null : Number(valueAsNumber)]);
				}}
				placeholder={label ? label[1] : undefined}
				inputPlaceholder={placeholder ? placeholder[1] : undefined}
				className='size-full bg-transparent px-8 text-center ltr placeholder:text-center'
				prefix={type === 'percent' ? <PercentPrefix /> : undefined}
				autoTranslateLegend
			/>
		</>
	);
};

const SingleNumber = ({ value, placeholder, label, type, initialValue, onChange }: SingleNumberProps) => {
	return (
		<InputLegend
			value={value === null ? '' : value}
			onChange={(v) => {
				const valueAsNumber = convertStringToInteger(v);
				onChange(valueAsNumber === '' ? null : Number(valueAsNumber));
			}}
			placeholder={label}
			inputPlaceholder={placeholder}
			maxLength={16}
			className='size-full bg-transparent px-8 text-left ltr placeholder:text-right'
			autoTranslateLegend
			prefix={type === 'percent' ? <PercentPrefix /> : undefined}
		/>
	);
};

const ArrayString = ({ value, data, initialValue, onChange }: ArrayStringProps) => {
	const isExists = (v: string) => {
		return value.includes(v);
	};

	const onClick = (v: string, exists: boolean) => {
		onChange(exists ? value.filter((item) => item !== v) : [...value, v]);
	};

	return data.map((item) => {
		const exists = isExists(item.value);

		return (
			<button
				onClick={() => onClick(item.value, exists)}
				key={item.value}
				type='button'
				className={clsx(
					'flex-1 gap-8 rounded !border font-medium',
					!item?.className
						? exists
							? 'btn-primary'
							: 'btn-primary-outline'
						: exists
							? item.className.enable
							: item.className.disabled,
				)}
			>
				{item?.icon}
				{item.title}
			</button>
		);
	});
};

const SingleString = (props: SingleStringProps) => {
	return <div />;
};

const RangeDate = (props: RangeDateProps) => {
	return <div />;
};

const SingleDate = (props: SingleDateProps) => {
	return <div />;
};

export const PercentPrefix = () => (
	<span className='h-24 w-36 text-tiny text-gray-700 flex-justify-center'>
		<PercentSVG width='1.2rem' height='1.2rem' className='text-gray-700' />
	</span>
);

export default StrategyFilters;
