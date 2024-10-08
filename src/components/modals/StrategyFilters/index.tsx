import ErrorBoundary from '@/components/common/ErrorBoundary';
import BaseSymbolAdvanceSearch from '@/components/common/Symbol/BaseSymbolAdvanceSearch';
import { useAppDispatch } from '@/features/hooks';
import { setStrategyFiltersModal } from '@/features/slices/modalSlice';
import { type NStrategyFilter } from '@/features/slices/types/modalSlice.interfaces';
import { useInputs } from '@/hooks';
import { useTranslations } from 'next-intl';
import { forwardRef, useEffect, useState } from 'react';
import Modal, { Header } from '../Modal';
import ArrayString from './components/ArrayString';
import Filter from './components/Filter';
import RangeDate from './components/RangeDate';
import RangeNumber from './components/RangeNumber';
import SingleDate from './components/SingleDate';
import SingleNumber from './components/SingleNumber';
import SingleString from './components/SingleString';

type TFilterValue = Record<
	string,
	string | number | Date | [number | null, number | null] | Array<string | null> | [Date | null, Date | null] | null
>;

type TInput = TFilterValue & {
	baseSymbols: Option.BaseSearch[];
};

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

		const onClear = () => {
			const newFilters: TInput = {
				baseSymbols: [],
			};

			for (let i = 0; i < filters.length; i++) {
				const filter = filters[i];

				if (filter.mode === 'array') {
					if (filter.type === 'string') newFilters[filter.id] = [];
					continue;
				}

				if (filter.mode === 'range') {
					newFilters[filter.id] = [null, null];
					continue;
				}

				if (filter.mode === 'single') {
					newFilters[filter.id] = null;
					continue;
				}
			}

			setInputs(newFilters);
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
				<div style={{ width: '70rem' }} className='max-w-full bg-white flex-column darkness:bg-gray-50'>
					<Header label={t('title')} onClose={onCloseModal} onClear={onClear} />

					<div className='gap-32 p-24 flex-column'>
						<form onSubmit={submit} className='gap-24 bg-white flex-column darkness:bg-gray-50'>
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
				</div>
			</Modal>
		);
	},
);

export default StrategyFilters;
