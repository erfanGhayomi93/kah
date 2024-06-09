import Tooltip from '@/components/common/Tooltip';
import { InfoCircleSVG } from '@/components/icons';
import { useAppDispatch } from '@/features/hooks';
import { setStrategyFiltersModal } from '@/features/slices/modalSlice';
import { type NStrategyFilter } from '@/features/slices/types/modalSlice.interfaces';
import { useInputs } from '@/hooks';
import { useTranslations } from 'next-intl';
import { forwardRef, useEffect } from 'react';
import Modal, { Header } from '../Modal';

type TInput = Record<string, string | string[] | number | number[] | Date | Date[]>;

interface ShareInputProps<T> {
	value: T;
	onChange: (id: string, v: T) => void;
}

interface RangeNumberProps extends ShareInputProps<[number, number]>, NStrategyFilter.IRangeNumber {}

interface SingleNumberProps extends ShareInputProps<number>, NStrategyFilter.ISingleNumber {}

interface ArrayStringProps extends ShareInputProps<string[]>, NStrategyFilter.IArrayString {}

interface SingleStringProps extends ShareInputProps<string>, NStrategyFilter.ISingleString {}

interface RangeDateProps extends ShareInputProps<[Date, Date]>, NStrategyFilter.IRangeDate {}

interface SingleDateProps extends ShareInputProps<Date>, NStrategyFilter.ISingleDate {}

interface FilterProps {
	title: string;
	titleHint?: string;
	children?: React.ReactNode;
}

interface StrategyFiltersProps extends NStrategyFilter.IFilters {}

const StrategyFilters = forwardRef<HTMLDivElement, StrategyFiltersProps>(
	({ initialFilters, filters, suppressBaseSymbol = false, onSubmit, ...props }, ref) => {
		const t = useTranslations('strategy_filters');

		const { inputs, setFieldValue, setInputs } = useInputs<TInput>({});

		const dispatch = useAppDispatch();

		const onCloseModal = () => {
			dispatch(setStrategyFiltersModal(null));
		};

		const submit = (e: React.FormEvent) => {
			e.preventDefault();

			try {
				onSubmit();
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
						onChange={(n, v) => setFieldValue(n, v)}
					/>
				);
			}

			if (item.mode === 'single') {
				if (item.type === 'date') {
					return (
						<SingleDate
							{...item}
							value={inputs[item.id] as Date}
							onChange={(n, v) => setFieldValue(n, v)}
						/>
					);
				}

				if (item.type === 'string') {
					return (
						<SingleString
							{...item}
							value={inputs[item.id] as string}
							onChange={(n, v) => setFieldValue(n, v)}
						/>
					);
				}

				return (
					<SingleNumber
						{...item}
						value={inputs[item.id] as number}
						onChange={(n, v) => setFieldValue(n, v)}
					/>
				);
			}

			if (item.mode === 'range') {
				if (item.type === 'date') {
					return (
						<RangeDate
							{...item}
							value={inputs[item.id] as [Date, Date]}
							onChange={(n, v) => setFieldValue(n, v)}
						/>
					);
				}

				return (
					<RangeNumber
						{...item}
						value={inputs[item.id] as [number, number]}
						onChange={(n, v) => setFieldValue(n, v)}
					/>
				);
			}

			return null;
		};

		useEffect(() => {
			const values: TInput = {};

			for (let i = 0; i < filters.length; i++) {
				const item = filters[i];
				values[item.id] = item.initialValue;
			}

			setInputs(values);
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
							{filters.map((item) => (
								<li key={item.id}>
									<Filter title={item.title} titleHint={item.titleHint}>
										{renderFilterChildren(item)}
									</Filter>
								</li>
							))}
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

const Filter = ({ title, titleHint, children }: FilterProps) => (
	<li className='h-40 flex-justify-between'>
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

		<div style={{ flex: '0 0 32.8rem' }} className='flex h-40 gap-8'>
			{children}
		</div>
	</li>
);

const RangeNumber = (props: RangeNumberProps) => {
	return <></>;
};

const SingleNumber = (props: SingleNumberProps) => {
	return <div />;
};

const ArrayString = (props: ArrayStringProps) => {
	return <div />;
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

export default StrategyFilters;
