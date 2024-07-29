import ipcMain from '@/classes/IpcMain';
import BaseSymbolAdvanceSearch from '@/components/common/Symbol/BaseSymbolAdvanceSearch';
import { initialOptionWatchlistFilters } from '@/constants/filters';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { getOptionFiltersModal, setOptionFiltersModal } from '@/features/slices/modalSlice';
import { type IOptionFiltersModal } from '@/features/slices/types/modalSlice.interfaces';
import { useInputs } from '@/hooks';
import { useTranslations } from 'next-intl';
import { forwardRef } from 'react';
import styled from 'styled-components';
import Modal, { Header } from '../Modal';
import Filter from './Filter';
import DeltaInput from './inputs/DeltaInput';
import EndDateInput from './inputs/EndDateInput';
import MinimumTradesValueInput from './inputs/MinimumTradesValueInput';
import StatusInput from './inputs/StatusInput';
import TypeInput from './inputs/TypeInput';

const Div = styled.div`
	width: 560px;
`;

interface OptionWatchlistFiltersModalProps extends IBaseModalConfiguration {}

const OptionWatchlistFiltersModal = forwardRef<HTMLDivElement, OptionWatchlistFiltersModalProps>((props, ref) => {
	const t = useTranslations('option_watchlist_filters_modal');

	const dispatch = useAppDispatch();

	const initialModalFilters = useAppSelector(getOptionFiltersModal) as Partial<IOptionFiltersModal>;

	const {
		inputs: filters,
		setFieldValue,
		setInputs: setFilters,
	} = useInputs<IOptionWatchlistFilters>({
		symbols: initialModalFilters?.initialSymbols ?? initialOptionWatchlistFilters.symbols,
		type: initialModalFilters?.initialType ?? initialOptionWatchlistFilters.type,
		status: initialModalFilters?.initialStatus ?? initialOptionWatchlistFilters.status,
		dueDays: initialModalFilters?.initialDueDays ?? initialOptionWatchlistFilters.dueDays,
		delta: initialModalFilters?.initialDelta ?? initialOptionWatchlistFilters.delta,
		minimumTradesValue:
			initialModalFilters?.initialMinimumTradesValue ?? initialOptionWatchlistFilters.minimumTradesValue,
	});

	const onCloseModal = () => {
		dispatch(setOptionFiltersModal(null));
	};

	const onClear = () => {
		setFilters(initialOptionWatchlistFilters);
	};

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		try {
			ipcMain.send('set_option_watchlist_filters', filters);
		} catch (e) {
			//
		} finally {
			onCloseModal();
		}
	};

	return (
		<Modal transparent top='14%' onClose={onCloseModal} {...props} ref={ref}>
			<Div className='darkBlue:bg-gray-50 gap-40 bg-white flex-column dark:bg-gray-50'>
				<Header label={t('title')} onClose={onCloseModal} onClear={onClear} />

				<form onSubmit={onSubmit} method='get' className='gap-64 px-24 pb-24 flex-column'>
					<div className='gap-32 flex-column'>
						<div className='gap-8 flex-column'>
							<span className='flex-1 font-medium text-gray-800'>{t('base_symbol')}</span>

							<BaseSymbolAdvanceSearch
								values={filters.symbols}
								onChange={(values) => setFieldValue('symbols', values)}
							/>
						</div>

						<ul className='gap-32 flex-column'>
							<Filter title={t('type')}>
								<TypeInput value={filters.type} onChange={(value) => setFieldValue('type', value)} />
							</Filter>

							<Filter title={t('status')}>
								<StatusInput
									value={filters.status}
									onChange={(value) => setFieldValue('status', value)}
								/>
							</Filter>

							<Filter title={t('end_date')}>
								<EndDateInput
									value={filters.dueDays}
									onChange={(value) => setFieldValue('dueDays', value)}
								/>
							</Filter>

							<Filter title={t('delta')}>
								<DeltaInput value={filters.delta} onChange={(value) => setFieldValue('delta', value)} />
							</Filter>

							<Filter title={t('minimum_trades_value')}>
								<MinimumTradesValueInput
									value={filters.minimumTradesValue}
									onChange={(value) => setFieldValue('minimumTradesValue', value)}
								/>
							</Filter>
						</ul>
					</div>

					<div className='flex-justify-end'>
						<button type='submit' className='h-40 w-328 rounded px-56 font-medium btn-primary'>
							{t('apply_filter')}
						</button>
					</div>
				</form>
			</Div>
		</Modal>
	);
});

export default OptionWatchlistFiltersModal;
