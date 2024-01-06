import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import styled from 'styled-components';
import ContractSizeInput from './inputs/ContractSizeInput';
import DeltaInput from './inputs/DeltaInput';
import EndDateInput from './inputs/EndDateInput';
import MinimumTradesValueInput from './inputs/MinimumTradesValueInput';
import StatusInput from './inputs/StatusInput';
import TypeInput from './inputs/TypeInput';

const InputWrapper = styled.div`
	flex: 0 0 28.6rem;
`;

const initialFilters: IOptionWatchlistFilters = {
	symbols: [],
	type: null,
	status: null,
	endDate: [null, null],
	contractSize: [-1, -1],
	delta: [-1, -1],
	minimumTradesValue: -1,
};

const Form = () => {
	const t = useTranslations();

	const [filters, setFilters] = useState<IOptionWatchlistFilters>(initialFilters);

	const setFilterValue = <T extends keyof IOptionWatchlistFilters>(field: T, value: IOptionWatchlistFilters[T]) => {
		setFilters((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
	};

	const clear = () => {
		setFilters(initialFilters);
	};

	const clearButtonIsDisabled = JSON.stringify(initialFilters) === JSON.stringify(filters);

	return (
		<form onSubmit={onSubmit} method='get' className='gap-48 flex-column'>
			<div className='gap-32 flex-column'>
				<ul className='gap-32 flex-column *:h-40 *:flex-justify-between'>
					<li>
						<span className='flex-1 font-medium text-gray-100'>{t('option_watchlist_filters_modal.type')}:</span>
						<InputWrapper>
							<TypeInput value={filters.type} onChange={(value) => setFilterValue('type', value)} />
						</InputWrapper>
					</li>
					<li>
						<span className='flex-1 whitespace-nowrap font-medium text-gray-100'>
							{t('option_watchlist_filters_modal.status')}:
						</span>
						<InputWrapper>
							<StatusInput value={filters.status} onChange={(value) => setFilterValue('status', value)} />
						</InputWrapper>
					</li>
					<li>
						<span className='flex-1 whitespace-nowrap font-medium text-gray-100'>
							{t('option_watchlist_filters_modal.end_date')}:
						</span>
						<InputWrapper>
							<EndDateInput value={filters.endDate} onChange={(value) => setFilterValue('endDate', value)} />
						</InputWrapper>
					</li>
					<li>
						<span className='flex-1 whitespace-nowrap font-medium text-gray-100'>
							{t('option_watchlist_filters_modal.contract_size')}:
						</span>
						<InputWrapper>
							<ContractSizeInput value={filters.contractSize} onChange={(value) => setFilterValue('contractSize', value)} />
						</InputWrapper>
					</li>
					<li>
						<span className='flex-1 whitespace-nowrap font-medium text-gray-100'>
							{t('option_watchlist_filters_modal.delta')}:
						</span>
						<InputWrapper>
							<DeltaInput value={filters.delta} onChange={(value) => setFilterValue('delta', value)} />
						</InputWrapper>
					</li>
					<li>
						<span className='flex-1 whitespace-nowrap font-medium text-gray-100'>
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
					onClick={clear}
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
