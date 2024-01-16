import { type IOptionFiltersModal } from '@/@types/slices/modalSlice';
import ipcMain from '@/classes/IpcMain';
import { XSVG } from '@/components/icons';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getOptionFiltersModal, toggleOptionFiltersModal } from '@/features/slices/modalSlice';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import styled from 'styled-components';
import styles from './index.module.scss';
import BaseSymbolInput from './inputs/BaseSymbolInput';
import ContractSizeInput from './inputs/ContractSizeInput';
import DeltaInput from './inputs/DeltaInput';
import EndDateInput from './inputs/EndDateInput';
import MinimumTradesValueInput from './inputs/MinimumTradesValueInput';
import StatusInput from './inputs/StatusInput';
import TypeInput from './inputs/TypeInput';

const InputWrapper = styled.div`
	flex: 0 0 32rem;
	overflow: hidden;
	max-width: 100%;
`;

export const initialFilters: IOptionWatchlistFilters = {
	symbols: [],
	type: [],
	status: [],
	endDate: [null, null],
	contractSize: [-1, -1],
	delta: [-1, -1],
	minimumTradesValue: -1,
};

const Form = () => {
	const t = useTranslations();

	const dispatch = useAppDispatch();

	const initialModalFilters = useAppSelector(getOptionFiltersModal) as Partial<IOptionFiltersModal>;

	const [filters, setFilters] = useState<IOptionWatchlistFilters>({
		symbols: initialModalFilters.initialSymbols ?? initialFilters.symbols,
		type: initialModalFilters.initialType ?? initialFilters.type,
		status: initialModalFilters.initialStatus ?? initialFilters.status,
		endDate: initialModalFilters.initialEndDate ?? initialFilters.endDate,
		contractSize: initialModalFilters.initialContractSize ?? initialFilters.contractSize,
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

	const onRemoveSymbol = (deleteIndex: number) => {
		setFilterValue(
			'symbols',
			filters.symbols.filter((_, index) => index !== deleteIndex),
		);
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

	const displayableSymbols = useMemo(() => {
		const { symbols } = filters;

		if (symbols.length <= 5) return symbols;
		return symbols.slice(0, 5);
	}, [filters.symbols]);

	const clearButtonIsDisabled = JSON.stringify(initialFilters) === JSON.stringify(filters);

	return (
		<form onSubmit={onSubmit} method='get' className='gap-48 flex-column'>
			<div className='gap-32 flex-column'>
				<div className='gap-8 flex-column'>
					<span className='flex-1 font-medium text-gray-100'>{t('option_watchlist_filters_modal.base_symbol')}</span>
					<BaseSymbolInput values={filters.symbols} onChange={(values) => setFilterValue('symbols', values)} />

					{filters.symbols.length > 0 && (
						<ul className={styles.tags}>
							{displayableSymbols.map((item, index) => (
								<li key={index}>
									<span className='truncate'>{item}</span>
									<button onClick={() => onRemoveSymbol(index)} type='button'>
										<XSVG width='0.8rem' height='0.8rem' />
									</button>
								</li>
							))}
							{filters.symbols.length > 5 && <li className={styles.count}>+{filters.symbols.length - 5}</li>}
						</ul>
					)}
				</div>

				<ul className='gap-32 flex-column'>
					<li className='h-40 flex-justify-between'>
						<span className='flex-1 font-medium text-gray-100'>{t('option_watchlist_filters_modal.type')}:</span>
						<InputWrapper>
							<TypeInput value={filters.type} onChange={(value) => setFilterValue('type', value)} />
						</InputWrapper>
					</li>
					<li className='h-40 flex-justify-between'>
						<span className='flex-1 whitespace-nowrap font-medium text-gray-100'>{t('option_watchlist_filters_modal.status')}:</span>
						<InputWrapper>
							<StatusInput value={filters.status} onChange={(value) => setFilterValue('status', value)} />
						</InputWrapper>
					</li>
					<li className='h-40 flex-justify-between'>
						<span className='flex-1 whitespace-nowrap font-medium text-gray-100'>{t('option_watchlist_filters_modal.end_date')}:</span>
						<InputWrapper>
							<EndDateInput value={filters.endDate} onChange={(value) => setFilterValue('endDate', value)} />
						</InputWrapper>
					</li>
					<li className='h-40 flex-justify-between'>
						<span className='flex-1 whitespace-nowrap font-medium text-gray-100'>{t('option_watchlist_filters_modal.contract_size')}:</span>
						<InputWrapper>
							<ContractSizeInput value={filters.contractSize} onChange={(value) => setFilterValue('contractSize', value)} />
						</InputWrapper>
					</li>
					<li className='h-40 flex-justify-between'>
						<span className='flex-1 whitespace-nowrap font-medium text-gray-100'>{t('option_watchlist_filters_modal.delta')}:</span>
						<InputWrapper>
							<DeltaInput value={filters.delta} onChange={(value) => setFilterValue('delta', value)} />
						</InputWrapper>
					</li>
					<li className='flex-justify-between'>
						<span className='flex-1 whitespace-nowrap font-medium text-gray-100'>{t('option_watchlist_filters_modal.minimum_trades_value')}:</span>
						<InputWrapper>
							<MinimumTradesValueInput value={filters.minimumTradesValue} onChange={(value) => setFilterValue('minimumTradesValue', value)} />
						</InputWrapper>
					</li>
				</ul>
			</div>

			<div className='flex-justify-between'>
				<button
					disabled={clearButtonIsDisabled}
					onClick={onClear}
					type='reset'
					className={clsx('h-40 rounded font-medium', clearButtonIsDisabled ? 'text-gray-300' : 'text-secondary-300')}
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
