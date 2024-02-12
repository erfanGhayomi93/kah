import { type IOptionFiltersModal } from '@/@types/slices/modalSlice';
import ipcMain from '@/classes/IpcMain';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getOptionFiltersModal, toggleOptionFiltersModal } from '@/features/slices/modalSlice';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import styled from 'styled-components';
import BaseSymbolInput from './inputs/BaseSymbolInput';
import DeltaInput from './inputs/DeltaInput';
import EndDateInput from './inputs/EndDateInput';
import MinimumTradesValueInput from './inputs/MinimumTradesValueInput';
import StatusInput from './inputs/StatusInput';
import TypeInput from './inputs/TypeInput';

const InputWrapper = styled.div`
	flex: 0 0 32rem;
	max-width: 100%;
`;

export const initialFilters: IOptionWatchlistFilters = {
	symbols: [],
	type: [],
	status: [],
	dueDays: [0, 365],
	delta: [-1, 1],
	minimumTradesValue: '',
};

const Form = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const initialModalFilters = useAppSelector(getOptionFiltersModal) as Partial<IOptionFiltersModal>;

	const [filters, setFilters] = useState<IOptionWatchlistFilters>({
		symbols: initialModalFilters.initialSymbols ?? initialFilters.symbols,
		type: initialModalFilters.initialType ?? initialFilters.type,
		status: initialModalFilters.initialStatus ?? initialFilters.status,
		dueDays: initialModalFilters.initialDueDays ?? initialFilters.dueDays,
		delta: initialModalFilters.initialDelta ?? initialFilters.delta,
		minimumTradesValue: initialModalFilters.initialMinimumTradesValue ?? initialFilters.minimumTradesValue,
	});

	const setFilterValue = <T extends keyof IOptionWatchlistFilters>(field: T, value: IOptionWatchlistFilters[T]) => {
		setFilters((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const onClear = () => {
		setFilters(initialFilters);
	};

	const onClose = () => {
		dispatch(toggleOptionFiltersModal(false));
	};

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		try {
			ipcMain.send('set_option_watchlist_filters', filters);
		} catch (e) {
			//
		} finally {
			onClose();
		}
	};

	const clearButtonIsDisabled = JSON.stringify(initialFilters) === JSON.stringify(filters);

	return (
		<form onSubmit={onSubmit} method='get' className='gap-64 px-24 pb-24 flex-column'>
			<div className='gap-32 flex-column'>
				<div className='gap-8 flex-column'>
					<span className='flex-1 font-medium text-gray-1000'>
						{t('option_watchlist_filters_modal.base_symbol')}
					</span>
					<BaseSymbolInput
						values={filters.symbols}
						onChange={(values) => setFilterValue('symbols', values)}
					/>
				</div>

				<ul className='gap-32 flex-column'>
					<li className='h-40 flex-justify-between'>
						<span className='flex-1 font-medium text-gray-1000'>
							{t('option_watchlist_filters_modal.type')}:
						</span>
						<InputWrapper>
							<TypeInput value={filters.type} onChange={(value) => setFilterValue('type', value)} />
						</InputWrapper>
					</li>
					<li className='h-40 flex-justify-between'>
						<span className='flex-1 whitespace-nowrap font-medium text-gray-1000'>
							{t('option_watchlist_filters_modal.status')}:
						</span>
						<InputWrapper>
							<StatusInput value={filters.status} onChange={(value) => setFilterValue('status', value)} />
						</InputWrapper>
					</li>
					<li className='h-40 flex-justify-between'>
						<span className='flex-1 whitespace-nowrap font-medium text-gray-1000'>
							{t('option_watchlist_filters_modal.end_date')}:
						</span>
						<InputWrapper>
							<EndDateInput
								value={filters.dueDays}
								onChange={(value) => setFilterValue('dueDays', value)}
							/>
						</InputWrapper>
					</li>
					<li className='h-40 flex-justify-between'>
						<span className='flex-1 whitespace-nowrap font-medium text-gray-1000'>
							{t('option_watchlist_filters_modal.delta')}:
						</span>
						<InputWrapper>
							<DeltaInput value={filters.delta} onChange={(value) => setFilterValue('delta', value)} />
						</InputWrapper>
					</li>
					<li className='flex-justify-between'>
						<span className='flex-1 whitespace-nowrap font-medium text-gray-1000'>
							{t('option_watchlist_filters_modal.minimum_trades_value')}:
						</span>
						<InputWrapper>
							<MinimumTradesValueInput
								value={filters.minimumTradesValue}
								onChange={(value) => setFilterValue('minimumTradesValue', value)}
							/>
						</InputWrapper>
					</li>
				</ul>
			</div>

			<div className='flex-justify-between'>
				<button
					disabled={clearButtonIsDisabled}
					onClick={onClear}
					type='reset'
					className={clsx(
						'h-40 rounded',
						clearButtonIsDisabled
							? 'text-gray-700'
							: 'font-medium text-error-200 transition-colors hover:text-error-100/80',
					)}
				>
					{t('common.clear_all')}
				</button>

				<button type='submit' className='h-40 rounded px-56 font-medium btn-primary'>
					{t('common.confirm')}
				</button>
			</div>
		</form>
	);
};

export default Form;
